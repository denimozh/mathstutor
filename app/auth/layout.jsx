import { ToastContainer, toast } from 'react-toastify';

export default function AuthLayout({ children }){
    return (
        <div className="bg-slate-50 h-screen w-full flex items-center justify-center">
            {children}
            <ToastContainer />
        </div>
    )
}