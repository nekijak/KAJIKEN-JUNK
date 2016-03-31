#!/usr/bin/python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from pprint import pprint
# vim:fenc=utf-8 ff=unix ft=python ts=2 sw=2 sts=2 si et nu list:
# vim:cinw=if,elif,else,for,while,try,except,finally,def,class:
# vim:listchars=tab\:>.,trail\:_,eol\:↲,extends\:>,precedes\:<,nbsp\:%:

# メイン処理(The main processing)
if __name__ == "__main__":
  # hoge,fuga.. is Japanese metasyntactic variable
  # dict is a reserved keyword. It's best not to use it as a varible name.
  data = dict(hoge='foo', fuga='bar')
  spam = "ham"

  # foo
  print "{hoge}".format(**data)

  # bar ham
  # locals is more special when used inside fuctions
  print "{data[fuga]} {spam}".format(**locals())
  outside = {'out': 'side'}
  def awesome(ok='go'):
    inside = {'in':'side'}
    print("Inside")
    pprint(inside)
    pprint(locals())
    print("Outside")
    print(outside)
    pprint(globals())
  awesome()
  # You can also modify a global varible in a local scope like so
  def do_nothing():
    outside = 'nope'
  do_nothing()
  print(outside) # {'out': 'side'}
  def alter_outside():
    global outside
    outside = 'neato'
  alter_outside()
  print(outside)


  # foo bar eggs
  print "{0[hoge]} {0[fuga]} {1}".format(data, "eggs")

  # foo bar baz
  # SyntaxError!
  print "{hoge} {fuga} {piyo}".format(piyo='baz', **data)

  # What is best practice?
  print "{0[hoge]} {0[fuga]} {piyo}".format(data, piyo="baz")

  # lol
  print "{hoge} {fuga} {piyo}".format(**(lambda : (lambda x=data.copy() : (x.update({"piyo":"baz"}),x)[-1])())())

  # Smart?
  f = lambda a,b: (lambda x=a.copy() : (x.update(b),x)[-1])()
  print "{hoge} {fuga} {piyo}".format(**f(data, {"piyo": "baz"}))
  # Anonymous functions are kind of tabuu in python - better, yes, but performance is sacrificed for developer efficiency.
  import this
  import webbrowser
  # Accepted coding standards of Python
  webbrowser.open('https://www.python.org/dev/peps/pep-0008/')
  # Most often, Visitor[0] and Factory[1] are the most common
  #  design patterns found in python.
  # Immutable types are almost non-existent; maybe because the threading model of python is limited by the GIL[2]
  # [0] https://ja.wikipedia.org/wiki/Visitor_%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3
  # [1] https://ja.wikipedia.org/wiki/Factory_Method_%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3
  # [2] https://ja.wikipedia.org/wiki/%E3%82%B0%E3%83%AD%E3%83%BC%E3%83%90%E3%83%AB%E3%82%A4%E3%83%B3%E3%82%BF%E3%83%97%E3%83%AA%E3%82%BF%E3%83%AD%E3%83%83%E3%82%AF


