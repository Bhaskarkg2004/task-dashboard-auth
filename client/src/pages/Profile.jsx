import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const Profile = () => {
    const { user } = useAuth();
    const { register, handleSubmit, setValue } = useForm();
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setValue('name', user.name);
            setValue('email', user.email);
        }
    }, [user, setValue]);

    const onSubmit = async (data) => {
        try {
            await api.put('/user/profile', { name: data.name });
            setMessage('Profile updated successfully');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Failed to update profile');
        }
    };

    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">User Profile</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and application.</p>
            </div>
            <div className="border-t border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} className="px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Full name</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <input
                                    {...register("name", { required: true })}
                                    className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md p-2 border"
                                />
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Email address</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {user?.email}
                                <span className="ml-2 text-xs text-gray-400">(Cannot be changed)</span>
                            </dd>
                        </div>
                        <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500"></dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                <button
                                    type="submit"
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Update Profile
                                </button>
                                {message && <span className="ml-3 text-sm text-green-600">{message}</span>}
                            </dd>
                        </div>
                    </dl>
                </form>
            </div>
        </div>
    );
};

export default Profile;
