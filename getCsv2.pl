#!/usr/bin/perl
use strict;
use utf8;
use Encode;
use DBI;

my $table = $ARGV[0];#"table";
unless ($table) {
  print "Usage: perl getCsv.pl [TableName]\n";
  exit;
}

my $dbh = DBI->connect('dbi:Oracle:host:port/db','user','pass');
my $sth = $dbh->prepare("SELECT * FROM $table");

$sth -> execute();

my $cnt = 0;
open(OUT, ">$table.csv");
while (my $arrayref = $sth->fetchrow_arrayref ) {
  my $col = join("\",\"", @$arrayref);
  $col =~ s/"(\d{4})\-(\d{2})\-(\d{2}) \d{2}:\d{2}:\d{2}"/"$1\/$2\/$3"/g;
  print OUT "\"" . $col . "\"\n";
  ++$cnt;
  print "Output $cnt\n" unless ($cnt % 1000);
}
close(OUT);
print "Complete! > Output $cnt\n";

$sth -> finish();
$dbh->disconnect();

__END__
