"use client";

import React from "react";
import { MdOutlineSearch, MdChevronLeft, MdChevronRight } from "react-icons/md";

const Transactions = () => {
  // No state or logic
  
  return (
    <div className='bg-[#f9f9f9] border border-white rounded-2xl h-full px-3 mt-4'>
      <div className='pt-8'>
        <div className='flex justify-between items-center'>                         
          <h1 className='font-semibold text-[#0F2C59] uppercase border-l-2 border-[#0F2C59] pl-1 text-sm'>Transaction History</h1>
          <div className='flex items-center'>
            <button className="bg-[#0F2C59] p-[5.3px] text-white rounded-l-md hover:text-[#0F2C59] hover:bg-gray-300 transition">
              <MdOutlineSearch size={20} />
            </button>
            <input 
              type="search" 
              name="search" 
              id="search" 
              placeholder="Search transactions..."
              className="bg-gray-100 text-xs outline-none border border-[#0F2C59] rounded-r-md px-2 w-[80px] sm:w-[200px] h-[31px]"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button className="px-3 py-1 text-xs rounded-full bg-[#0F2C59] text-white">
            All
          </button>
          <button className="px-3 py-1 text-xs rounded-full bg-gray-200">
            Recent Payment
          </button>
          
        </div>

        <div className='py-8 overflow-x-scroll'>
          <table className='w-full text-left text-sm'>
            <thead>
              <tr>
                <th className='bg-white text-[#0F2C59] border border-gray-300 px-4 py-2'>Transaction ID</th>
                {/* <th className='bg-white text-[#0F2C59] border border-gray-300 px-4 py-2'>Transaction Type</th> */}
                <th className='bg-white text-[#0F2C59] border border-gray-300 px-4 py-2'>Amount</th>
                <th className='bg-white text-[#0F2C59] border border-gray-300 px-4 py-2'>Date</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr>
                <td className='border border-gray-300 px-4 py-2'>ABC123</td>
                {/* <td className='border border-gray-300 px-4 py-2'>Paystack</td> */}
                <td className='border border-gray-300 px-4 py-2'>#500.00</td>
                <td className='border border-gray-300 px-4 py-2'>5/16/2025, 12:00:00 PM</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center pb-4">
          <div className="text-xs text-gray-500">
            Showing 1 to 2 of 2 transactions
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
              <MdChevronLeft size={20} />
            </button>
            <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-xs">
              Page 1 of 1
            </div>
            <button className="p-2 rounded-md bg-gray-100 text-gray-400 cursor-not-allowed">
              <MdChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;