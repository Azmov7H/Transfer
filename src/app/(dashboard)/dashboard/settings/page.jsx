import Notification from '@/components/dashboard/settings/Notefction'
import Profiel from '@/components/dashboard/settings/Profiel'
import React from 'react'

export default function page() {
  return (
    <div className='flex flex-col gap-4'>
        <Profiel />
        <Notification />
    </div>
  )
}
