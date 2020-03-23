"Plugins
call plug#begin("~/.vim/plugged")

"Colorscheme
Plug 'gilgigilgil/anderson.vim'

"Airline
Plug 'vim-airline/vim-airline'
Plug 'vim-airline/vim-airline-themes'

call plug#end()

"Colors
let $NVIM_TUI_ENABLE_TRUE_COLOR=1
syntax enable
"colorscheme anderson
set background=light

"Spaces and tabs
set tabstop=4
set softtabstop=4
set shiftwidth=4
set expandtab
set autoindent
set copyindent

"Indentation
set autoindent
set smartindent
set breakindent

"UI Config
set hidden
set number
set showcmd
set cursorline
set wildmenu
set showmatch
set laststatus=2

"Folding
set foldenable
set foldlevelstart=10
set foldnestmax=10
set foldmethod=syntax

"Mappings
nnoremap j gj
nnoremap k gk

"Airline
let g:airline_powerline_fonts = 0
let g:airline#extensions#tabline#enabled = 1
let g:airline#extensions#tabline#buffer_nr_show = 1

let g:airline_theme='luna'
"let g:airline_solarized_bg='dark'
