import React from 'react'
import {
  Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Button, Heading, HStack, Text, VStack, Image, Spinner,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import FiPlus from "../../assets/icons/fi_plus.png";
import AdvertisementPage from "../adsData/AdvertisementPage";

const AdsList = () => {
  return (
    <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
        <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
        <BreadcrumbItem>
          <BreadcrumbLink href="/overview">
            <GoHomeFill color="#5570F1" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/ads-menu" color="#8B8D97" fontSize="13px">
           Advertisement List
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack justifyContent="space-between" gap="20px">
              <Heading color="#45464E" fontSize="16px" fontWeight="600">
                Advertisements
              </Heading>
              <Button
                as={"a"}
                href="/ads-menu/add-new-ads"
                bg="#3E60AA"
                color="white"
                padding="0px 12px"
                borderRadius="12px"
                w="155px"
                h="36px"
                fontSize="14px"
              >
                <img src={FiPlus} width={"20px"} alt="" />
                Add New Ads
              </Button>
            </HStack>

            <AdvertisementPage/>
      </Box>
  )
}

export default AdsList;