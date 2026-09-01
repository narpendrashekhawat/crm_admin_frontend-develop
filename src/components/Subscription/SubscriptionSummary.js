import React, { useState, useEffect } from "react";
import {
  Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Button, Heading, HStack, Text, VStack, Image, Spinner,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";

import card1 from "../../assets/icons/card1.svg";
import card2 from "../../assets/icons/card2.svg";
import FiPlus from "../../assets/icons/fi_plus.png";
import SubscriptionPage from "../Subscription/SubscriptionPage"; 
import {Config} from "../Utils/Config" 

  

  const SubscriptionSummary = () => {

    const [loading, setLoading] = useState(false);

  const [counts, setCounts] = useState({
    totalCount: 0,
    activeCount: 0,
    inactiveCount: 0
  });
  // API call on mount
  useEffect(() => {
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Config?.Subscription_url}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`
          }
        });
         // API string values ko number me convert
        setCounts({
          totalCount: Number(res.data.counts.totalCount),
          activeCount: Number(res.data.counts.activeCount),
          inactiveCount: Number(res.data.counts.inactiveCount)
        });
      } catch (err) {
        console.error("Error fetching subscriptions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);
  
  return (
    <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
      <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
        <BreadcrumbItem>
          <BreadcrumbLink href="/overview">
            <GoHomeFill color="#5570F1" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink href="/Subscriptions-status" color="#8B8D97" fontSize="13px">
            Subscription List
          </BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <HStack justifyContent="space-between" gap="20px">
        <Heading color="#45464E" fontSize="16px" fontWeight="600">
          Subscription Summary
        </Heading>
        <Button
          as={"a"}
          href="/Subscriptions-status/add-Subscription"
          bg="#3E60AA"
          color="white"
          padding="0px 12px"
          borderRadius="12px"
          w="155px"
          h="36px"
          fontSize="14px"
        >
          <img src={FiPlus} width={"20px"} alt="" />
          Add Subscription
        </Button>
      </HStack>

      {loading ? (
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <HStack flexWrap="wrap" gap="19px" mt="1rem">
          {/* card 1 */}
          <Box
            backgroundColor="#F0F4F9"
            padding="10px 15px"
            display="flex"
            flexDirection="column"
            gap="60px"
            flex={1}
            borderRadius="12px"
            width={"100%"}
          >
            <HStack justifyContent="space-between" height="41px" alignItems="center">
              <Image background="#fcf2e0" padding="8px" width="35px" borderRadius="5px" src={card1} />
            </HStack>
            <HStack justifyContent="space-between" width="87%">
              <VStack alignItems="flex-start">
                <Text color="#8B8D97" fontSize="14px">Total Subscriptions</Text>
                <Text color="#45464E" fontSize="20px" fontWeight="500">{counts.totalCount}</Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Text color="#8B8D97" fontSize="14px">Active</Text>
                <Text color="#45464E" fontSize="20px" fontWeight="500">{counts.activeCount}</Text>
              </VStack>
              <VStack alignItems="flex-start">
                <Text color="#8B8D97" fontSize="14px">Inactive</Text>
                <Text color="#45464E" fontSize="20px" fontWeight="500">{counts.inactiveCount}</Text>
              </VStack>
            </HStack>
          </Box>

          {/* card 2 */}
          <Box
            backgroundColor="#F0F4F9"
            padding="10px 15px"
            display="flex"
            flexDirection="column"
            gap="60px"
            flex={1}
            borderRadius="12px"
            width={"100%"}
            position={"relative"}
          >
            <HStack justifyContent="space-between" height="100px" alignItems="center">
              <Image background="#fcf2e0" padding="8px" width="35px" borderRadius="5px" src={card2}  position={"absolute"} top={"15px"} />
            </HStack>
            <HStack justifyContent="space-between" width="87%">
              <VStack alignItems="flex-start">
                {/* <Text color="#8B8D97" fontSize="14px">Revenue (₹)</Text>
                <Text color="#45464E" fontSize="20px" fontWeight="500">1,25,000</Text> */}
              </VStack>
            </HStack>
          </Box>
        </HStack>
      )}

      {/* Subscription Table */}
      <SubscriptionPage setCounts={setCounts}/>
    </Box>
  );
};

export default SubscriptionSummary;
