import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  InputGroup,
  InputLeftElement,
  Input,
  IconButton,
  Badge,
  HStack,
  Img,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  VStack,
  Circle,
  Button
} from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom"; // Import Link
import profile_icon from "../../assets/images/profile.svg";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Config } from "../Utils/Config";
import { useAuth } from "../Context/authContext";

const HeaderBar = ({ LastActivity, IPAddr, ProfileIcon }) => {
  const { authToken, userId, removeAuthData } = useAuth();


  const [notifications, setNotifications] = useState([
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: false },
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: null },
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: false },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: false },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: false },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: false },
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: false },
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: false },
    { title: "Low Stock Warning!!", message: "Your 10 medicines are running low. Please restock soon.", time: "00", seen: false },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: true },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: false },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: true },
    { title: "New Sales Order Received", message: "You have received a new sales order.", time: "00", seen: true },
  ]);

  //    useEffect(() => {
  //     const fetchNotifications = async () => {
  //       try {
  //         const res = await axios.get(`${Config.Notification_url}`, {
  //                             headers: {
  //                                 Authorization: `Bearer ${localStorage.getItem('authToken')}`
  //                             }
  //                         })
  //         setNotifications(res.data);
  //       } catch (err) {
  //         console.error("Error fetching notifications:", err);
  //       }
  //     };

  //     fetchNotifications();
  //   }, []);


  //   const handleMarkAsSeen = (id) => {
  //   setNotifications((prev) =>
  //     prev.map((n) =>
  //       n.id === id ? { ...n, seen: true } : n
  //     )
  //   );
  // };

  return (
    <HStack borderRadius="md" alignItems='flex-start' mt='1rem'>
      <InputGroup width='95%' >
        <InputLeftElement pointerEvents="none" top='9px' left='9px' disabled />
        <Input
          readOnly
          type="text"
          placeholder={`Last Login Date and Time: ${LastActivity ?? new Date().toLocaleString()}  Last Login IP: ${IPAddr ?? "0.0.0.0"}`}
          borderRadius="full"
          bg="white"
          padding='12px 12px 12px 50px'
          height='55px'
          color={"#666666"}
          _placeholder={{ color: "#666666", fontWeight: "500" }}
          borderColor='transparent'
          outline='none'
          boxShadow='0px 2px 4px #8c8c9130'
        />
      </InputGroup>

      <Flex justifyContent={"space-between"} width={"120px"} ml='5px' gap={3} bg='white' padding='8px' borderRadius='40px' boxShadow='0px 2px 4px #8c8c9130'>
        <Menu>
          <Box
            position="relative"
            border="4px solid white"
            borderRadius="24px"
            boxShadow="0px 2px 4px #e7e7e7"

          >
            {/* Bell Button */}
            <MenuButton
              as={IconButton}
              icon={<IoNotificationsOutline />}
              aria-label="Notifications"
              variant="ghost"
              borderRadius="full"
              backgroundColor="#F0F1F7"
              size="sm"
            />
            {/* Badge */}
            <Badge
              position="absolute"
              top="-6px"
              right="-6px"
              bg="#FBE9D0"
              color="black"
              fontWeight="600"
              borderRadius="full"
              fontSize="10px"
              h="18px"
              minW="18px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {notifications.filter(n => !n.seen).length}
            </Badge>
          </Box>

          {/* Dropdown */}
          <MenuList maxW="320px" p="0" borderRadius="12px" overflow="hidden">
            {/* Heading */}
            <Box px="14px" py="10px" bg="#f7f7f7" borderBottom="1px solid #ddd">
              <Text fontSize="md" fontWeight="bold">Notifications</Text>
            </Box>
            <Box maxH="250px" overflowY="auto">
              {notifications.length === 0 ? (
                <Box p={4} textAlign="center">
                  No notifications
                </Box>
              ) : (
                notifications.map((n) => (
                  <MenuItem key={n.id} display="flex" alignItems="center">
                    <Box flex="1">
                      <Text fontSize="sm" fontWeight="600">{n.title}</Text>
                      <Text fontSize="xs" color="gray.600">
                        {n.message}
                      </Text>
                      <Text fontSize="10px" color="gray.400">
                        {n.time}
                      </Text>
                    </Box>

                    {/* 🔹 Seen / Unseen dot */}
                    <Circle
                      size="5px"
                      bg={n.seen ? "green.400" : "red.400"}
                      ml={2}
                      boxShadow="0 0 4px 2px rgba(0,0,0,0.3)"
                    />
                  </MenuItem>
                ))
              )}
            </Box>
          </MenuList>
        </Menu>


        {/* Profile Avatar with Link to /manufacturers/profile */}

        <Menu>
          <MenuButton as={'Button'} >
            <Link to="/manufacturers/profile">
              <Img
                width='41px'
                height='41px'
                src={ProfileIcon ?? profile_icon}
                borderRadius={"50%"}
                cursor="pointer"

              />

            </Link>
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => {
              localStorage.clear();
              removeAuthData();
              window.location.replace('/');
            }}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </HStack>
  );
};

export default HeaderBar;