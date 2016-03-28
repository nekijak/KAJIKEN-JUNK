#!/usr/bin/python
#coding:utf-8
# vim:fenc=utf-8 ff=unix ft=python ts=2 sw=2 sts=2 si et nu list:
# vim:cinw=if,elif,else,for,while,try,except,finally,def,class:
# vim:listchars=tab\:>.,trail\:_,eol\:↲,extends\:>,precedes\:<,nbsp\:%:

# メイン処理(The main processing)
if __name__ == "__main__":
  # hoge,fuga.. is Japanese metasyntactic variable
  dict = {"hoge":"foo", "fuga":"bar"}
  spam = "ham"

  # foo
  print "{hoge}".format(**dict)

  # bar ham
  print "{dict[fuga]} {spam}".format(**locals())

  # foo bar eggs
  print "{0[hoge]} {0[fuga]} {1}".format(dict, "eggs")

  # foo bar baz
  # SyntaxError!
  #print "{hoge} {fuga} {piyo}".format(**dict, piyo="baz")

  # What is best practice?
  print "{0[hoge]} {0[fuga]} {piyo}".format(dict, piyo="baz")

  # lol
  print "{hoge} {fuga} {piyo}".format(**(lambda : (lambda x=dict.copy() : (x.update({"piyo":"baz"}),x)[-1])())())

  # Smart?
  f = lambda a,b: (lambda x=a.copy() : (x.update(b),x)[-1])()
  print "{hoge} {fuga} {piyo}".format(**f(dict, {"piyo": "baz"}))
