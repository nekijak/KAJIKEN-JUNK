#!/usr/bin/perl
use strict;
use utf8;
use Encode;
use POSIX;
use CGI qw(:cgi);

use CGI;
my $q = CGI->new;
my $fileName = $q->param('file'); # PGDJ010.html
my $data;

open(IN, "<$fileName");
{
  local $/ = undef;
  $data = <IN>;
}
close(IN);

$data =~ s/(<FONT.+?>|<\/FONT>|\r|\n|\t|<BR>)//g;
$data =~ s/.*<BODY.+?>//g;
$data =~ s/<\/BODY.*>//g;

my @table = split(/<TR>/, $data);
my $width = 9;
if($table[0] =~ /WIDTH=(\d+)/) {
  $width = $1;
}
my $cols = 1;
if($table[0] =~ /COLS=(\d+)/) {
  $cols = $1;
}
shift @table;

print << "EOH";
Content-type: text/html

<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta content="text/html; charset=UTF-8" http-equiv="content-type">
</head>
<body>
<pre>
EOH
foreach(@table) {
  my @tr = split(/<TD/, $_);
  shift @tr;
  my $oversp = 0;
  foreach(@tr) {
    my $col = 1;
    my $align = "LEFT";
    if(/COLSPAN=(\d+) /) {
      $col = $1;
    }
    if(/ALIGN=(\w+) /) {
      $align = $1;
    }
    my $disp = $_;
    $disp =~ s/(^.*?>|<.+?>)//g;
    utf8::decode($disp);

    my $len = length(Encode::encode('cp932', $disp));
    my $pad = 0;
    if ($col >= $len) {
      $pad = $col - $len;
      if ($oversp > 0 && $pad > 0) {
        if ($pad > $oversp) {
          $pad -= $oversp;
          $oversp = 0;
        } else {
          if ($len == 0 && $pad == 1) {
            $oversp -= $pad;
            $pad = 0;
          } else {
            $oversp -= ($pad - 1);
            $pad = 1;
          }
        }
      }
    } else {
      $oversp += $len - $col;
    }
    if ($align eq "LEFT") {
      print $disp . " " x $pad;
    } elsif ($align eq "CENTER") {
      my $pad_left = floor($pad / 2);
      print " " x $pad_left . $disp . " " x ($pad - $pad_left);
    } else {
      print " " x $pad . $disp;
    }
  }
  print "\n";
}
print << "EOH";
</pre>
</body>
</html>
EOH

__END__
