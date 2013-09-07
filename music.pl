#!/usr/bin/perl
#--------------------------------------------------------------------------#
#  Music Player for Raspberry PI [music.pl]
#  Copyright (C) 2013, KAJIKEN
#  http://www.kajiken.jp/
#  kajiken@kajiken.com
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
#--------------------------------------------------------------------------#
use strict;
use utf8;
use Encode;
use DBI;
use MP3::Tag;
use File::ReadBackwards;
use Encode::Guess qw/shift-jis euc-jp 7bit-jis/;

# Settings
my $base_dir = "/home/pi/share";
my $play_db = $base_dir . "/.playlist.db";
my $resume_file = $base_dir . "/.resume.txt";
my $data_source = "dbi:SQLite:dbname=$play_db";

# Main
while (1) {
  &main();
}

sub main {
  # TODO:User Settings

  # Read PlayList
  my @file = &load_list();

  # Default Seek Point
  my $ss = "0.0";

  # Create PlayList
  if (0 > $#file || 0 == length($file[0])) {
    # TODO:SubFolder not random
    # Random
    @file = sort { int(rand(3)) - 1 } glob $base_dir . "/mp3/*.mp3";
    if (0 > $#file) {
      # TODO:ファイルが1個も無いときは操作待機に入る
      exit;
    }
    &save_list(@file);
  } else {
    # Resume Seek Point
    $ss = &resume_load();
  }

  # Play
  # TODO:Loop
  while (1) {
    my $music = shift @file;
    chomp $music;
    if (-f $music) {
      my ($title, $artist) = &get_tags($music);
      print "Play Start -> $artist $title\n";
      `mplayer -ss $ss "$music" 2>&1 1>$resume_file`;
      $ss = "0.0";
      print "Play End.\n";
    }
    &delete_record($music);
    if (0 > $#file || 0 == length($file[0])) {
      print "Play List End of File.\n";
      last;
    }
  }
}

sub get_tags {
  my $title = "";
  my $artist = "";
  my $mp3 = MP3::Tag->new($_[0]);
  $mp3->get_tags() or die;
  if (exists $mp3->{ID3v2}) {
    my $id3v2 = $mp3->{ID3v2};
    $title  = &dec_tag($id3v2, 'TIT2') || "";
    $artist = &dec_tag($id3v2, 'TPE1') || "";
  }
  $mp3->close();
  $title = $1 if ($title eq "" && $_[0] =~ /\/([^\/]+?)\.mp3$/);
  return ($title, $artist);
}

sub dec_tag {
  return &dec($_[0]->get_frame($_[1]));
}

sub dec {
  my $decoder = Encode::Guess->guess($_[0]);
  ref($decoder) || return "";
  return "utf8" eq $decoder->name ? encode('UTF-8', $_[0]) : encode('UTF-8', $decoder->decode($_[0]));
}

sub resume_load {
  my $bw = File::ReadBackwards->new($resume_file);
  my $wk = $bw->readline;
  $wk =~ s/\r/\n/g;
  my @wks = split(/\n/, $wk);
  my $seek = pop(@wks);
  $seek =~ s/^A: +(\d+\.\d) .+$/$1/g;
  $seek = "0.0" unless ($seek =~ /^\d+\.\d$/);
  print "Seek Point : " . $seek . "\n";
  return $seek;
}

sub create_table {
  print "Create Tables.\n";
  my $dbh = DBI->connect($data_source);
  $dbh->do("create table playlist (path);");
  $dbh->disconnect;
}

sub load_list {
  print "Load Play List.\n";
  unless (-f $play_db) {
    &create_table();
    return undef;
  }

  my $dbh = DBI->connect($data_source);
  my $sth = $dbh->prepare("select path from playlist;");
  $sth->execute;
  my @file;
  while (my @row = $sth->fetchrow_array) {
    push (@file, $row[0]);
  }
  $sth->finish();
  $dbh->disconnect;
  return @file;
}

sub delete_record {
  my $dbh = DBI->connect($data_source);
  $dbh->do("delete from playlist where path = '$_[0]';");
  $dbh->disconnect;
}

sub save_list {
  print "Save Play List.\n";
  my $dbh = DBI->connect($data_source, undef, undef, {PrintError => 1, AutoCommit => 0});
  my $sth = $dbh->prepare("insert into playlist (path) values (?);");
  foreach (@_) {
    chomp;
    $sth->execute($_) unless /^\s*$/;
  }
  $dbh->commit;
  $dbh->disconnect;
}

__END__
