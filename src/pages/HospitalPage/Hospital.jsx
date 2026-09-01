import React from 'react'
import LeftSidebar from '../../components/LeftSideBarLayout/LeftSideBar'
import HeaderBar from '../../components/Header/HeaderBar'
import Footer from '../../components/footer'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, HStack } from '@chakra-ui/react'
import HospitalInfo from './HospitalInfo'
import { GoHomeFill } from 'react-icons/go'

export default function Hospital() {
  return (
    <>
      <Box backgroundColor='#F0F4F9' height={"100%"}>
     
        <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
          <LeftSidebar />
          <Box width='80%'>
            <HeaderBar />
            <HospitalInfo />
            
            <Footer />
          </Box>
        </HStack>
      </Box>
    </>
  )
}

