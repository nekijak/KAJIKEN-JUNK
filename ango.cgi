#!/usr/bin/perl
## 解けそうで意外と解けない簡略暗号化
use strict;
use CGI::Carp qw(fatalsToBrowser);
use utf8;
use MIME::Base64;
use String::Random;

#print "Content-type: text/html\n\n";
my $ango = "foo bar";
$ango = &cryptkj($ango);
print $ango;
#print "\n";
print &decryptkj($ango);

sub cryptkj {
  my $str = $_[0];

  if (length($str) < 20) {
    $str .= " " . String::Random->new->randregex('[A-Za-z0-9]{' . eval(20 - length($str)) . '}');
  }

  my @list = split(/ /, reverse $str);
  my @crlist = ();

  foreach (@list) {
    my $cr = "";
    foreach (split //) {
      $cr .= $_ . String::Random->new->randregex('[A-Za-z0-9]');
    };
    push(@crlist, $cr);
  }

  $str = join(" ", @crlist);
  return &encode_base64(&encode_base64($str));
}

sub decryptkj {
  my $str = &decode_base64(&decode_base64($_[0]));

  {
    my @crlist = split(/ /, $str);
    if ($#crlist == 2) {
      $str = $crlist[1] . " " . $crlist[2];
    }
  }

  my @crlist = ();
  foreach (split(/ /, $str)) {
    my $cr = "";
    my $i = 0;
    foreach (split //) {
      unless ($i % 2) {
        $cr .= $_;
      }
      $i++;
    }
    push(@crlist, $cr);
  }

  $str = reverse(join(" ", @crlist));
  return $str;
}

__END__
