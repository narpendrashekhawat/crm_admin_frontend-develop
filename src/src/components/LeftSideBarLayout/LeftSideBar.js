import React, { useEffect, useState } from "react";
import {
  Text,
  Divider,
  Img,
  Box,
  List,
  ListItem,
  HStack,
  VStack
} from "@chakra-ui/react";
import logo from "../../assets/images/sidebar_logo.svg";
import { Link, useLocation } from "react-router-dom";
import overview from "../../assets/icons/overview.svg";
import manufacturer from "../../assets/icons/manufacturer.svg";
import retailer from "../../assets/icons/retailer.svg";
import catalogue from "../../assets/icons/catalogue.svg";
import mapping from "../../assets/icons/mapping.svg";
import distributor from "../../assets/icons/distributor.svg";

const LeftSidebar = () => {
  const [activepath, setActivePath] = useState();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const active = businessItems.find(item => path.includes(item.path)) ||
      products.find(item => path.includes(item.path));
    setActivePath(active ? active.id : '1');
  }, [location.pathname]);

  const businessItems = [
    { id: '1', label: 'Overview', path: '/overview', icon: overview },
    { id: '2', label: 'Manufacturer List', path: '/manufacturers', icon: manufacturer },
    { id: '3', label: 'Distributor/ CNf List', path: '/distributors', icon: distributor },
    { id: '4', label: 'Retailer List', path: '/retailers', icon: retailer }
  ];

  const products = [
    { id: '5', label: 'Product Catalogue', path: '/product-catalogue', icon: catalogue },
    { id: '6', label: 'Mapping', path: '/mapping', icon: mapping }
  ];

  return (
    <Box width='265px' paddingLeft='5px'>
      <Box>
        <HStack justifyContent='center'>
          <Img src={logo} alt="Jee1_logo" />
        </HStack>
        <Divider width='240px' borderBottomWidth='2px' color='#d8dbe4' opacity='1' />
      </Box>

      <VStack width='269px' alignItems='flex-start' gap='18px'>
        {/* Business Section */}
        <Box>
          <Text fontSize="12px" color='#8C8C91' padding='8px 12px' textTransform='uppercase'>Business</Text>
          <List spacing={3}>
            {businessItems.map((item) => (
              <Link to={item.path} key={item.id}>
                <ListItem
                  key={item.id}
                  color={"#0B0C14"}
                  width={"237px"}
                  display='flex'
                  alignItems='center'
                  gap='12px'
                  backgroundColor={activepath === item.id ? 'rgba(31, 31, 31,3%)' : 'transparent'}
                  borderRadius={activepath === item.id ? '20px' : '0px'}
                  border={activepath === item.id ? '1px solid rgba(31, 31, 31,0.03)' : '1px solid transparent'}
                  padding={activepath === item.id ? '9px 12px' : '9px 12px'}
                >
                  <Box>
                    <Img src={item.icon} alt="menu_icons" />
                  </Box>
                  <Text fontSize={"16px"} color={"#0B0C14"}>{item.label}</Text>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>

        {/* Products Section */}
        <Box>
          <Text fontSize="12px" color='#8C8C91' padding='8px 12px' textTransform='uppercase'>Products</Text>
          <List spacing={3}>
            {products.map((item) => (
              <Link to={item.path} key={item.id}>
                <ListItem
                  key={item.id}
                  display='flex'
                  alignItems='center'
                  gap='12px'
                  color={"#0B0C14"}
                  width={"237px"}
                  backgroundColor={activepath === item.id ? 'rgba(31, 31, 31,3%)' : 'transparent'}
                  borderRadius={activepath === item.id ? '20px' : '0px'}
                  border={activepath === item.id ? '1px solid rgba(31, 31, 31,0.03)' : '1px solid transparent'}
                  padding={activepath === item.id ? '9px 12px' : '9px 12px'}
                >
                  <Box>
                    <Img src={item.icon} alt="menu_icons" />
                  </Box>
                  <Text>{item.label}</Text>
                </ListItem>
              </Link>
            ))}
          </List>
        </Box>
      </VStack>
    </Box>
  );
};

export default LeftSidebar;
