import React, { useContext, useEffect, useState } from 'react'
import { manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import AppContext from '../context/AppContext'
import axios, { toFormData } from 'axios'
import { toast } from 'react-toastify'

const ManageJobs = () => {

    const navigate = useNavigate()

    const [jobs, setJobs] = useState([])

    const { backendUrl, companyToken } = useContext(AppContext)

    // Function to fetch company job applications data
    const fetchCompanyJobs = async () => {


        try {

            const { data } = await axios.get(backendUrl + '/api/company/list-jobs', { headers: { token: companyToken } })

            if (data.success) {
                console.log(data.jobsData)
                setJobs(data.jobsData.reverse())
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)

        }

    }

    // function to change job visibility
    const changeJobVisiblity = async (id) => {
        try {

            const { data } = await axios.post(backendUrl + '/api/company/change-visiblity', {
                id
            }, {
                headers: { token: companyToken }
            })

            if (data.success) {
                toast.success(data.message)
                fetchCompanyJobs()
            }
            else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (companyToken) {
            fetchCompanyJobs()
        }
    }, [companyToken])

    return (
        <div className='container p-4 max-w-5xl'>
            <div className='overflow-x-auto'>
                <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                    <thead>
                        <tr>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden' >#</th>
                            <th className='py-2 px-4 border-b text-left' >Job title</th>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden' >Date</th>
                            <th className='py-2 px-4 border-b text-left max-sm:hidden' >Location</th>
                            <th className='py-2 px-4 border-b text-center' >Applicants</th>
                            <th className='py-2 px-4 border-b text-left' >Visible</th>
                        </tr>
                    </thead>
                    <tbody>
                        {manageJobsData.map((job, index) => (
                            <tr key={index} className='text-gray-700' >
                                <td className='py-2 px-4 border-b max-sm:hidden'>{index + 1}</td>
                                <td className='py-2 px-4 border-b'>{job.title}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                                <td className='py-2 px-4 border-b text-center '>{job.applicants}</td>
                                <td className='py-2 px-4 border-b'>
                                    <input onChange={() => changeJobVisiblity(job._id)} type="checkbox" className='scale-125 ml-4' checked={job.visiblity} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className='mt-4 flex justify-end'>
                <button onClick={() => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'>Add new Job</button>
            </div>
        </div>
    )
}

export default ManageJobs