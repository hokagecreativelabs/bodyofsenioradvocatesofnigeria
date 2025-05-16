import React from 'react'
import { FaCog } from "react-icons/fa";
import { MdPayments, MdOutlineAllInclusive } from "react-icons/md";
import { RiSecurePaymentFill } from "react-icons/ri";

export const UserStats = () => {
  return (
    <div>
        <div className='shadow h-[25rem] lg:h-[10rem]  py-7 px-4 block lg:flex lg:justify-between space-y-5 '>
            <div className='shadow-sm h-[100px] lg:w-[20rem] space-y-3 text-[#0F2C59] font-medium rounded-md'>
                <div className='flex items-center justify-between px-6 pt-5 '>
                    <MdPayments className='h-7 w-7' />
                    <p># 0</p>
                </div>
                <h1 className='px-6 text-sm'>Next Payment</h1>
            </div>

            <div className='shadow-sm h-[100px] lg:w-[20rem] space-y-3 text-[#0F2C59] font-medium rounded-md'>
                <div className='flex items-center justify-between px-6 pt-5 '>
                    <RiSecurePaymentFill className='h-7 w-7' />
                    <p># 0</p>
                </div>
                <h1 className='px-6 text-sm'>Outstanding Payment</h1>
            </div>

            <div className='shadow-sm h-[100px] lg:w-[20rem] space-y-3 text-[#0F2C59] font-medium rounded-md'>
                <div className='flex items-center justify-between px-6 pt-5 '>
                    <MdOutlineAllInclusive className='h-7 w-7' />
                    <p>0</p>
                </div>
                <h1 className='px-6 text-sm'>Total Transactions</h1>
            </div>
        </div>
    </div>
  ) 
}
