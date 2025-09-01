import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import Swal from 'sweetalert2';
import z from 'zod';

export default function Register() {

  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const zodSchema = z.object({
    name: z.string().min(3, 'Minimum number of characters is 3').max(20, 'Maximum number of characters is 20'),
    email: z.string().email('Must be a valid mail'),
    password: z.string().min(8, 'Password must be at least 8 characters long').regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, `Password Must:
      Has at least one uppercase letter
      Has at least one lowercase letter
      Has at least one digit
      Has at least one special character from #?!@$%^&*-`),
    rePassword: z.string().min(1, 'rePassword is required'),
    dateOfBirth: z.string().refine((d) => {
      const givenDate = new Date(d);
      const today = new Date();
      today.setHours(0, 0, 0, 0)

      return givenDate < today
    }, "Can't enter future date"),
    gender: z.enum(['male', 'female'], 'Must choose gender')
  }).refine((obj) => obj.password === obj.rePassword, {
    error: 'rePassword must be the same as password',
    path: ["rePassword"],

  })



  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: ""
    },
    resolver: zodResolver(zodSchema),
    mode: 'onBlur'
  })




  async function myHandleSubmit(values) {
    
    setIsLoading(true);
    try {
      const { data } = await axios.post('https://linked-posts.routemisr.com/users/signup', values);
      console.log(data.message);
      Swal.fire({
        title: data.message,
        text: "Congratulations",
        icon: 'success',
        confirmButtonText: 'OK'
      }).then(() => {
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      })

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
            <h2 className='text-center font-extrabold text-6xl bg-gradient-to-br from-red-700 to-blue-800 bg-clip-text text-transparent p-2.5'>Register</h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md ">
          <div className="bg-white  py-8 px-4 shadow rounded-lg sm:px-10">
            <form onSubmit={handleSubmit(myHandleSubmit)}>
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="username">
                  Username
                </label>
                <div className="mt-1">
                  <input {...register('name')} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="text" id="username" />
                </div>
                {formState.errors.name && formState.dirtyFields.name && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500">{formState.errors.name.message}</p>
                  </div>
                </div>}
              </div>
              <div className="mt-6">
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
                <label className="block text-sm font-medium text-gray-700" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input {...register('rePassword')} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="password" id="confirm-password" />
                </div>

                {formState.errors.rePassword && formState.dirtyFields.rePassword && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500">{formState.errors.rePassword.message}</p>
                  </div>
                </div>}
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700" htmlFor="dob">
                  Date of Birth
                </label>
                <div className="mt-1">
                  <input {...register('dateOfBirth')} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" type="date" id="dob" />
                </div>

                {formState.errors.dateOfBirth && formState.dirtyFields.dateOfBirth && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500">{formState.errors.dateOfBirth.message}</p>
                  </div>
                </div>}
              </div>
              <div className="flex items-center justify-center mt-6">
                <span className="mr-3 text-gray-700 font-medium">Gender:</span>
                <label className="inline-flex items-center">
                  <input {...register('gender')} type="radio" className="form-radio h-5 w-5 text-pink-600" name="gender" defaultValue="male" />
                  <span className="ml-2 text-gray-700">Male</span>
                </label>
                <label className="inline-flex items-center ml-6">
                  <input {...register('gender')} type="radio" className="form-radio h-5 w-5 text-purple-600" name="gender" defaultValue="female" />
                  <span className="ml-2 text-gray-700">Female</span>
                </label>

                {formState.errors.gender && formState.dirtyFields.gender && <div className=" peer-invalid:block">
                  <div className="mt-2 flex items-center gap-1">
                    <div className="w-4 fill-rose-500">
                      <svg viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24,12A12,12,0,1,1,12,0,12.013,12.013,0,0,1,24,12ZM13,5H11V15h2Zm0,12H11v2h2Z" />
                      </svg>
                    </div>
                    <p className="Capitalize font-medium text-rose-500">{formState.errors.gender.message}</p>
                  </div>
                </div>}
              </div>

              <div className="mt-6">
                <button className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" type="submit">
                  {isLoading ? <ClipLoader /> : 'Sign up'}
                </button>
              </div>

              <div className="mt-6 text-center">
                <p className='text-sm font-medium text-gray-700'>Have account already ? <Link to={'/login'} className='text-blue-600 underline hover:no-underline'>Sign in</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>



    </>
  )
}
