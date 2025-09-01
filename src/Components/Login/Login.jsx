import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import z from 'zod';
import { tokenContextObj } from '../../Context/TokenContextProvider';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const {modifyToken} = useContext(tokenContextObj);

  const navigate = useNavigate();

  const zodSchema = z.object({
    email: z.string().email('Must be a valid mail'),
    password: z.string().min(8, 'Password must be at least 8 characters long').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, `Password Must:
      Has at least one uppercase letter
      Has at least one lowercase letter
      Has at least one digit
      Has at least one special character from #?!@$%^&*-`)
  })



  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(zodSchema),
    mode: 'onBlur'
  })



  async function myHandleSubmit(values) {    
    setIsLoading(true);
    try {
      const {data}  = await axios.post('https://linked-posts.routemisr.com/users/signin', values);
      modifyToken(data.token);
      localStorage.setItem('tkn',data.token);
      setTimeout(() => {
          navigate('/home');
        }, 500);
    } catch (error) {
      console.log(error.response.data.error);
      Swal.fire({
        title: 'Failed',
        text: error.response.data.error,
        icon: 'error',
        confirmButtonText: 'OK'
      })

    } finally {
      setIsLoading(false);
    }

  }


  return (
    <>

      <div className="flex flex-col justify-center py-20 sm:px-6 lg:px-8 mx-10 ">
        <h2 className='text-center font-extrabold text-6xl bg-gradient-to-br from-red-700 to-blue-800 bg-clip-text text-transparent p-2.5'>Login</h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
          <div className="bg-white  py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(myHandleSubmit)}>
      
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email address
                </label>
                <div className="mt-1">
                  <input {...register('email')} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="text" id="email" />
                </div>

                {formState.errors.email && formState.dirtyFields.email && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500">{formState.errors.email.message}</p>
                  </div>
                </div>}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="mt-1">
                  <input {...register('password')} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="password" id="password" />
                </div>

                {formState.errors.password && formState.dirtyFields.password && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500 whitespace-pre-line">{formState.errors.password.message}</p>
                  </div>
                </div>}
              </div>

              <div className="mt-6">
                <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit">
                  {isLoading ? <ClipLoader /> : 'Sign in'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className='text-sm font-medium text-gray-700'>Don't have an account ? <Link to={'/register'} className='text-blue-600 underline hover:no-underline'>Sign Up</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>



    </>
  )

}
