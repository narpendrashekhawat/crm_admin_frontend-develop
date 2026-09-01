import React from "react";
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
} from "@chakra-ui/react";
import { IoNotificationsOutline } from "react-icons/io5";
import { Link } from "react-router-dom"; // Import Link
import profile_icon from "../../assets/images/profile.svg";
import { ChevronDownIcon } from "@chakra-ui/icons";

const HeaderBar = ({ LastActivity, IPAddr, ProfileIcon }) => {
  return (
    <HStack borderRadius="md" alignItems='flex-start' mt='1rem'>
      <InputGroup width='95%' >
        <InputLeftElement pointerEvents="none" top='9px' left='9px' disabled />
        <Input
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
        <Box position="relative" border='4px solid white' borderRadius='24px' boxShadow='0px 2px 4px #e7e7e7'>
          <IconButton
            icon={<IoNotificationsOutline />}
            aria-label="Notifications"
            variant="ghost"
            borderRadius="full"
            backgroundColor='#F0F1F7'
            size="sm"
          />
          <Badge
            position="absolute"
            top="-6px"
            right="-6px"
            bg="#FBE9D0"
            color="black"
            fontWeight={400}
            borderRadius="full"
            fontSize="11px"
            px='6px'
          >
            1
          </Badge>
        </Box>

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
    <MenuItem onClick={()=>{
      localStorage.clear();
      window.location.replace('/');
    }}>Logout</MenuItem>
  </MenuList>
</Menu>
      </Flex>
    </HStack>
  );
};

export default HeaderBar;
