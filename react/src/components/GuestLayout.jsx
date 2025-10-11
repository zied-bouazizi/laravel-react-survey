import { Outlet } from "react-router-dom";

export default function GuestLayout() {
  return (
    <div>
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                    className="mx-auto h-12 w-auto"
                    src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                    />
                </div> 
                
                <Outlet />     
            </div>
        </div>
    </div>
  )
}
