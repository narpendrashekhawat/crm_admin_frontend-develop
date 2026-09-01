import { HStack } from '@chakra-ui/react'
import { Box } from 'lucide-react'
import React from 'react'
import LeftSidebar from '../LeftSideBarLayout/LeftSideBar'
import HeaderBar from '../Header/HeaderBar'
import ProductCatalogueItemsInfo from './ProductCatalogueItemsInfo'
import UploadStockSheet from './UploadStockSheet'

const NewProductEditProductPage = () => {
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <UploadStockSheet />
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default NewProductEditProductPage