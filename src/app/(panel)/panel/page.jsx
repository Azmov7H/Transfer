import Body from '@/components/Panel/Body'
import Head from '@/components/Panel/Head'
import { Card } from '@/components/ui/card'
import React from 'react'

export default function page() {
  return (
    <Card className={'gap-4 space-y-4'} >
      <Head />
      <Body />
    </Card>
  )
}
