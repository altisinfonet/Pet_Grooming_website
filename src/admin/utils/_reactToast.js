import { toast } from 'react-toastify';
const autoClose = 2000;
const position = "top-right"


const _INFO = (msg = "INFO's TOAST!") => {
    toast.info(<span className='cammleCase'>{msg}</span>, { position, autoClose });
}

const _ERROR = (msg = "INFO's TOAST!", timeForClose = 0) => {
    toast.error(<span className='cammleCase'>{msg}</span>, { position, autoClose: timeForClose ? timeForClose : autoClose });
}

const _SUCCESS = (msg = "INFO's TOAST!") => {
    toast.success(<span className='cammleCase'>{msg}</span>, { position, autoClose });
}

const _WERNING = (msg = "WERNING's TOAST!") => {
    toast.warn(<span className='cammleCase'>{msg}</span>, { position, autoClose });
}

export {
    _INFO,
    _ERROR,
    _SUCCESS,
    _WERNING
}