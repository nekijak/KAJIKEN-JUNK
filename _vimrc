"=============================================================================
"    Description: .vimrc�T���v���ݒ�
"         Author: anonymous
"  Last Modified: 0000-00-00 00:00
"        Version: 7.40
"=============================================================================
set nocompatible
scriptencoding cp932
" scriptencoding�ƁA���̃t�@�C���̃G���R�[�f�B���O����v����悤���ӁI
" scriptencoding�́Avim�̓����G���R�[�f�B���O�Ɠ������̂𐄏����܂��B
" ���s�R�[�h�� set fileformat=unix �ɐݒ肷���unix�ł��g���܂��B

" Windows�œ����G���R�[�f�B���O�� cp932�ȊO�ɂ��Ă��āA
" ���ϐ��ɓ��{����܂ޒl��ݒ肵�����ꍇ�� Let ���g�p���܂��B
" Let�� vimrc(�I�[���C�������p�b�P�[�W�̏ꍇ)�� encode.vim �Œ�`����܂��B
" Let $HOGE=$USERPROFILE.'/�ق�'

"----------------------------------------
" ���[�U�[�����^�C���p�X�ݒ�
"----------------------------------------
" Windows, unix�ł�runtimepath�̈Ⴂ���z�����邽�߂̂��́B
" $MY_VIMRUNTIME�̓��[�U�[�����^�C���f�B���N�g���������B
" :echo $MY_VIMRUNTIME�Ŏ��ۂ̃p�X���m�F�ł��܂��B
if isdirectory($HOME . '/.vim')
  let $MY_VIMRUNTIME = $HOME.'/.vim'
elseif isdirectory($HOME . '\vimfiles')
  let $MY_VIMRUNTIME = $HOME.'\vimfiles'
elseif isdirectory($VIM . '\vimfiles')
  let $MY_VIMRUNTIME = $VIM.'\vimfiles'
endif

" �����^�C���p�X��ʂ��K�v�̂���v���O�C�����g�p����ꍇ�A
" $MY_VIMRUNTIME���g�p����� Windows/Linux�Ő؂蕪����K�v�������Ȃ�܂��B
" ��) vimfiles/qfixapp (Linux�ł�~/.vim/qfixapp)�Ƀ����^�C���p�X��ʂ��ꍇ
" set runtimepath+=$MY_VIMRUNTIME/qfixapp

"----------------------------------------
" �����G���R�[�f�B���O�w��
"----------------------------------------
" �����G���R�[�f�B���O��UTF-8���ƕ����R�[�h�̎����F���ݒ��encode.vim�ōs���B
" �I�[���C�������p�b�P�[�W�̏ꍇ vimrc�Őݒ肳��܂��B
" �G���R�[�f�B���O�w��╶���R�[�h�̎����F���ݒ肪�K�؂ɐݒ肳��Ă���ꍇ�A
" ���s�� encode.vim�Ǎ������̓R�����g�A�E�g���ĉ������B
" silent! source $MY_VIMRUNTIME/pluginjp/encode.vim
" scriptencoding�ƈقȂ�����G���R�[�f�B���O�ɕύX����ꍇ�A
" �ύX��ɂ�scriptencoding���w�肵�Ă����Ɩ�肪�N���ɂ����Ȃ�܂��B
" scriptencoding cp932

"----------------------------------------
" �V�X�e���ݒ�
"----------------------------------------
" mswin.vim��ǂݍ���
" source $VIMRUNTIME/mswin.vim
" behave mswin

" �t�@�C���̏㏑���̑O�Ƀo�b�N�A�b�v�����/���Ȃ�
" set writebackup���w�肵�Ă��I�v�V���� 'backup' ���I���łȂ�����A
" �o�b�N�A�b�v�͏㏑���ɐ���������ɍ폜�����B
set nowritebackup
" �o�b�N�A�b�v/�X���b�v�t�@�C�����쐬����/���Ȃ�
set nobackup
if version >= 703
  " �ēǍ��Avim�I������p������A���h�D(7.3)
  " set undofile
  " �A���h�D�̕ۑ��ꏊ(7.3)
  " set undodir=.
endif
" set noswapfile
" viminfo���쐬���Ȃ�
" set viminfo=
" �N���b�v�{�[�h�����L
set clipboard+=unnamed
" 8�i���𖳌��ɂ���B<C-a>,<C-x>�ɉe������
set nrformats-=octal
" �L�[�R�[�h��}�b�s���O���ꂽ�L�[�񂪊�������̂�҂���(�~���b)
set timeout timeoutlen=3000 ttimeoutlen=100
" �ҏW���ʔ�ۑ��̃o�b�t�@����A�V�����o�b�t�@���J���Ƃ��Ɍx�����o���Ȃ�
set hidden
" �q�X�g���̕ۑ���
set history=50
" ���{��̍s�̘A�����ɂ͋󔒂���͂��Ȃ�
set formatoptions+=mM
" Visual block���[�h�Ńt���[�J�[�\����L���ɂ���
set virtualedit=block
" �J�[�\���L�[�ōs���^�s���̈ړ��\�ɐݒ�
set whichwrap=b,s,[,],<,>
" �o�b�N�X�y�[�X�ŃC���f���g����s���폜�ł���悤�ɂ���
set backspace=indent,eol,start
" ���⁛�̕����������Ă��J�[�\���ʒu������Ȃ��悤�ɂ���
set ambiwidth=double
" �R�}���h���C���⊮����Ƃ��ɋ������ꂽ���̂��g��
set wildmenu
" �}�E�X��L���ɂ���
if has('mouse')
  set mouse=a
endif
" plugin���g�p�\�ɂ���
filetype plugin indent on

"----------------------------------------
" ����
"----------------------------------------
" �����̎��ɑ啶������������ʂ��Ȃ�
" �������啶���������̗������܂܂�Ă���ꍇ�͑啶������������ʂ���
set ignorecase
set smartcase
" �������Ƀt�@�C���̍Ō�܂ōs������ŏ��ɖ߂�
set wrapscan
" �C���N�������^���T�[�`
set incsearch
" ���������̋����\��
set hlsearch
" w,b�̈ړ��ŔF�����镶��
" set iskeyword=a-z,A-Z,48-57,_,.,-,>
" vimgrep ���f�t�H���g��grep�Ƃ���ꍇinternal
" set grepprg=internal

"----------------------------------------
" �\���ݒ�
"----------------------------------------
" �X�v���b�V��(�N�����̃��b�Z�[�W)��\�����Ȃ�
" set shortmess+=I
" �G���[���̉��ƃr�W���A���x���̗}��(gvim��.gvimrc�Őݒ�)
set noerrorbells
set novisualbell
set visualbell t_vb=
" �}�N�����s���Ȃǂ̉�ʍĕ`����s��Ȃ�
" WindowsXp�܂���Window�e�[�}���uWindows�N���V�b�N�v��
" Google���{����͂��g�p�����I�r�[���J�[�\�����c��ꍇ�ɂ��L��
" set lazyredraw
" Windows�Ńf�B���N�g���p�X�̋�؂蕶���\���� / ���g����悤�ɂ���
set shellslash
" �s�ԍ��\��
set number
if version >= 703
  " ���΍s�ԍ��\��(7.3)
  " set relativenumber
endif
" ���ʂ̑Ή��\������
set showmatch matchtime=1
" �^�u��ݒ�
" set ts=4 sw=4 sts=4
" �����I�ɃC���f���g����
set autoindent
" C�C���f���g�̐ݒ�
set cinoptions+=:0
" �^�C�g����\��
set title
" �R�}���h���C���̍��� (gvim��gvimrc�Ŏw��)
" set cmdheight=2
set laststatus=2
" �R�}���h���X�e�[�^�X�s�ɕ\��
set showcmd
" ��ʍŌ�̍s���ł������\������
set display=lastline
" Tab�A�s���̔��p�X�y�[�X�𖾎��I�ɕ\������
set list
set listchars=tab:^\ ,trail:~

" �n�C���C�g��L���ɂ���
if &t_Co > 2 || has('gui_running')
  syntax on
endif
" �F�e�[�}�ݒ�
" gvim�̐F�e�[�}��.gvimrc�Ŏw�肷��
" colorscheme mylight

""""""""""""""""""""""""""""""
" �X�e�[�^�X���C���ɕ����R�[�h���\��
" iconv���g�p�\�̏ꍇ�A�J�[�\����̕����R�[�h���G���R�[�h�ɉ������\���ɂ���FencB()���g�p
""""""""""""""""""""""""""""""
if has('iconv')
  set statusline=%<%f\ %m\ %r%h%w%{'['.(&fenc!=''?&fenc:&enc).']['.&ff.']'}%=[0x%{FencB()}]\ (%v,%l)/%L%8P\ 
else
  set statusline=%<%f\ %m\ %r%h%w%{'['.(&fenc!=''?&fenc:&enc).']['.&ff.']'}%=\ (%v,%l)/%L%8P\ 
endif

" FencB() : �J�[�\����̕����R�[�h���G���R�[�h�ɉ������\���ɂ���
function! FencB()
  let c = matchstr(getline('.'), '.', col('.') - 1)
  let c = iconv(c, &enc, &fenc)
  return s:Byte2hex(s:Str2byte(c))
endfunction

function! s:Str2byte(str)
  return map(range(len(a:str)), 'char2nr(a:str[v:val])')
endfunction

function! s:Byte2hex(bytes)
  return join(map(copy(a:bytes), 'printf("%02X", v:val)'), '')
endfunction

"----------------------------------------
" diff/patch
"----------------------------------------
" diff�̐ݒ�
if has('win32') || has('win64')
  set diffexpr=MyDiff()
  function! MyDiff()
    " 7.3.443 �ȍ~�̕ύX�ɑΉ�
    silent! let saved_sxq=&shellxquote
    silent! set shellxquote=
    let opt = '-a --binary '
    if &diffopt =~ 'icase' | let opt = opt . '-i ' | endif
    if &diffopt =~ 'iwhite' | let opt = opt . '-b ' | endif
    let arg1 = v:fname_in
    if arg1 =~ ' ' | let arg1 = '"' . arg1 . '"' | endif
    let arg2 = v:fname_new
    if arg2 =~ ' ' | let arg2 = '"' . arg2 . '"' | endif
    let arg3 = v:fname_out
    if arg3 =~ ' ' | let arg3 = '"' . arg3 . '"' | endif
    let cmd = '!diff ' . opt . arg1 . ' ' . arg2 . ' > ' . arg3
    silent execute cmd
    silent! let &shellxquote = saved_sxq
  endfunction
endif

" ���o�b�t�@�̍����\��(�ύX�ӏ��̕\��)
command! DiffOrig vert new | set bt=nofile | r # | 0d_ | diffthis | wincmd p | diffthis
" �t�@�C���܂��̓o�b�t�@�ԍ����w�肵�č����\���B#�Ȃ痠�o�b�t�@�Ɣ�r
command! -nargs=? -complete=file Diff if '<args>'=='' | browse vertical diffsplit|else| vertical diffsplit <args>|endif
" �p�b�`�R�}���h
set patchexpr=MyPatch()
function! MyPatch()
   call system($VIM."\\'.'patch -o " . v:fname_out . " " . v:fname_in . " < " . v:fname_diff)
endfunction

"----------------------------------------
" �m�[�}�����[�h
"----------------------------------------
" �w���v����
nnoremap <F1> K
" ���݊J���Ă���vim�X�N���v�g�t�@�C�������s
nnoremap <F8> :source %<CR>
" �����S�ۑ��I���𖳌���
nnoremap ZZ <Nop>
" �J�[�\����j k �ł͕\���s�ňړ�����B�����s�ړ���<C-n>,<C-p>
" �L�[�{�[�h�}�N���ɂ͕����s�ړ��𐄏�
" h l �͍s���A�s���𒴂��邱�Ƃ��\�ɐݒ�(whichwrap)
nnoremap <Down> gj
nnoremap <Up>   gk
nnoremap h <Left>zv
nnoremap j gj
nnoremap k gk
nnoremap l <Right>zv

"----------------------------------------
" �}�����[�h
"----------------------------------------

"----------------------------------------
" �r�W���A�����[�h
"----------------------------------------

"----------------------------------------
" �R�}���h���[�h
"----------------------------------------

"----------------------------------------
" Vim�X�N���v�g
"----------------------------------------
""""""""""""""""""""""""""""""
" �t�@�C�����J������O��̃J�[�\���ʒu�ֈړ�
" $VIMRUNTIME/vimrc_example.vim
""""""""""""""""""""""""""""""
augroup vimrcEx
  autocmd!
  autocmd BufReadPost * if line("'\"") > 1 && line("'\"") <= line('$') | exe "normal! g`\"" | endif
augroup END

""""""""""""""""""""""""""""""
" �}�����[�h���A�X�e�[�^�X���C���̃J���[�ύX
""""""""""""""""""""""""""""""
let g:hi_insert = 'highlight StatusLine guifg=darkblue guibg=darkyellow gui=none ctermfg=blue ctermbg=yellow cterm=none'

if has('syntax')
  augroup InsertHook
    autocmd!
    autocmd InsertEnter * call s:StatusLine('Enter')
    autocmd InsertLeave * call s:StatusLine('Leave')
  augroup END
endif
" if has('unix') && !has('gui_running')
"   " ESC�ł����ɔ��f����Ȃ��΍�
"   inoremap <silent> <ESC> <ESC>
" endif

let s:slhlcmd = ''
function! s:StatusLine(mode)
  if a:mode == 'Enter'
    silent! let s:slhlcmd = 'highlight ' . s:GetHighlight('StatusLine')
    silent exec g:hi_insert
  else
    highlight clear StatusLine
    silent exec s:slhlcmd
    redraw
  endif
endfunction

function! s:GetHighlight(hi)
  redir => hl
  exec 'highlight '.a:hi
  redir END
  let hl = substitute(hl, '[\r\n]', '', 'g')
  let hl = substitute(hl, 'xxx', '', '')
  return hl
endfunction

""""""""""""""""""""""""""""""
" �S�p�X�y�[�X��\��
""""""""""""""""""""""""""""""
" �R�����g�ȊO�őS�p�X�y�[�X���w�肵�Ă���̂ŁAscriptencoding�ƁA
" ���̃t�@�C���̃G���R�[�h����v����悤���ӁI
" �����\������Ȃ��ꍇ�A������scriptencoding���w�肷��Ƃ��܂�������������܂��B
" scriptencoding cp932
function! ZenkakuSpace()
  silent! let hi = s:GetHighlight('ZenkakuSpace')
  if hi =~ 'E411' || hi =~ 'cleared$'
    highlight ZenkakuSpace cterm=underline ctermfg=darkgrey gui=underline guifg=darkgrey
  endif
endfunction
if has('syntax')
  augroup ZenkakuSpace
    autocmd!
    autocmd ColorScheme       * call ZenkakuSpace()
    autocmd VimEnter,WinEnter * match ZenkakuSpace /�@/
  augroup END
  call ZenkakuSpace()
endif

""""""""""""""""""""""""""""""
" grep,tags�̂��߃J�����g�f�B���N�g�����t�@�C���Ɠ����f�B���N�g���Ɉړ�����
""""""""""""""""""""""""""""""
" if exists('+autochdir')
"   "autochdir������ꍇ�J�����g�f�B���N�g�����ړ�
"   set autochdir
" else
"   "autochdir�����݂��Ȃ����A�J�����g�f�B���N�g�����ړ��������ꍇ
"   au BufEnter * execute ":silent! lcd " . escape(expand("%:p:h"), ' ')
" endif

"----------------------------------------
" �e��v���O�C���ݒ�
"----------------------------------------

"------------
" org
"-----------
" �R�}���h���[�h�ł̕⊮�ݒ�
"set wildmode=longest:full,list
"
"filetype off
"
"
"if has('vim_starting')
"  set runtimepath+=./vimfiles/bundle/neobundle.vim
"  call neobundle#rc(expand('./vimfiles/bundle/'))
"endif
"" originalrepos on github
"NeoBundle 'Shougo/neobundle.vim'
"NeoBundle 'Shougo/vimproc'
"NeoBundle 'VimClojure'
"NeoBundle 'Shougo/vimshell'
"NeoBundle 'Shougo/unite.vim'
"NeoBundle 'Shougo/neocomplcache'
"NeoBundle 'Shougo/neosnippet'
"NeoBundle 'jpalardy/vim-slime'
"NeoBundle 'scrooloose/syntastic'
"""NeoBundle 'https://bitbucket.org/kovisoft/slimv'
"
"filetype plugin indent on     " required!
"filetype indent on
"syntax on


"----------------------------------------
" �ꎞ�ݒ�
"----------------------------------------