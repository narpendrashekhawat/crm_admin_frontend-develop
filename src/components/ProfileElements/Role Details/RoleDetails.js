import React, { useState, useEffect } from "react";
import { Box, Table, Tbody, Tr, Td, Checkbox, Image, VStack, HStack, Text, Input } from "@chakra-ui/react";
import modulelogo from "../../../assets/images/img123.svg";

const RoleDetails = ({ modules = [], selectedModules, setSelectedModules, handleModuleCheck, onRoleChange, roleName, roleId, }) => {
  console.log(roleName, "iuiuiuiui")
  // Initialize selectedModules based on accessLevel if needed
  useEffect(() => {
    if (modules.length) {
      const initSelected = [];

      const traverse = (items) => {
        items.forEach((item) => {
          if (item.accessLevel === "Full") initSelected.push(item.moduleName);
          if (item.subModules?.length) traverse(item.subModules);
          if (item.components?.length) traverse(item.components);
        });
      };

      traverse(modules);

      // Only set if different
      if (initSelected.length > 0 && selectedModules.length === 0) {
        setSelectedModules(initSelected);
      }
    }
  }, [modules]); // 🚀 no selectedModules here


  // Toggle checkbox locally if handleModuleCheck is not provided
  const handleCheckbox = (moduleName) => {
    if (handleModuleCheck) {
      handleModuleCheck(moduleName);
    } else {
      setSelectedModules((prev) =>
        prev.includes(moduleName)
          ? prev.filter((m) => m !== moduleName)
          : [...prev, moduleName]
      );
    }
  };

  const getAllModuleNames = (items) => {
    const names = [];
    const traverse = (arr) => {
      arr.forEach((item) => {
        names.push(item.moduleName);
        if (item.subModules?.length) traverse(item.subModules);
        if (item.components?.length) traverse(item.components);
      });
    };
    traverse(items || []);
    return names;
  };

  const allNames = getAllModuleNames(modules);
  console.log("newnames", allNames);

  const handleSelectAll = () => {


    if (selectedModules.length === allNames.length) {
      setSelectedModules([]);
    } else {
      setSelectedModules(allNames);
    }
  }


  // Render nested subModules/components recursively
  const renderChildren = (children = [], level = 1) =>
    children.map((child) => (
      <React.Fragment key={child.moduleName}>
        <Tr borderTop={"1px solid #b5b3b365"} borderBottom={"1px solid #b5b3b365"} bg={level % 2 === 0 ? "#f5f5f5" : "#e8e8e8"}>
          <Td fontWeight={"bold"} display={"flex"} gap={1.5} pl={level * 20}> <Image src={modulelogo} />{child.moduleName}</Td>
          <Td textAlign="center" border={"1px solid #b5b3b365"} borderLeft={"1px solid #fff"}>
            <Checkbox
              isChecked={selectedModules.includes(child.moduleName)}
              onChange={() => handleCheckbox(child.moduleName)}
              border={"transparent"}
              borderRadius={"15%"}
              backgroundColor={"#797d8196"}
              colorScheme="transparent"
              iconColor="#0000009e"
              width={"20px"}
              h={"20px"}
              alignItems={"center"}
              iconSize={"12px"}
              paddingLeft={"2px"}
            />
          </Td>
        </Tr>

        {child.subModules && child.subModules.length > 0 && renderChildren(child.subModules, level + 1)}
        {child.components && child.components.length > 0 && renderChildren(child.components, level + 1)}
      </React.Fragment>
    ));

  return (
    <HStack align={"start"} maxW="900px" w="100%" spacing={3}>


      {/* Left Timeline bar */}
      <VStack
        gap="2px"
        marginInline={"1.125rem"}
        justifySelf={"center"}
        height={"full"}
        spacing={0}
        align="center"
        paddingTop={"1.5rem"}
        position={"relative"}
      >
        <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
        <Box position={"absolute"} top={'35px'} left={"4px"} width="1px" alignSelf="stretch" height={"800px"} backgroundColor="#DCDCDE" />
      </VStack>
      <VStack align="start" width={"100%"}>
        <VStack marginTop={"10px"} gap={"0"} align="start">
          <Text fontSize="18px" fontWeight="400">Role Details</Text>
          <Text fontSize="16px" color="#8C8C91">Assign Role Features</Text>
        </VStack>
        <HStack spacing={4} marginTop={"10px"} mb={2} justifyContent="space-between" alignItems="center" width="100%">
          <VStack marginLeft={"10px"} alignItems={"start"} gap={"1"}>
            <Text fontSize={"14px"} fontWeight={"500"} color={"#8C8C91"} paddingLeft={"5px"}>
              Role Name<sup>*</sup>
            </Text>
            <Input
              placeholder="Role Name"
              value={roleName}
              readOnly
              // onChange={(e) => onRoleChange("roleName", e.target.value)}
              w="250px"
            />
          </VStack>
          <HStack padding={"0.45rem"} borderRadius="12px" spacing={4} marginTop={"10px"} marginRight="86px" alignItems="center">
            <Checkbox
              // isDisabled={module.moduleName === "Overview" || module.moduleName === "Overview Page"}
              isChecked={selectedModules.length === allNames.length}
              onChange={handleSelectAll}
              border={"transparent"}
              borderRadius={"15%"}
              backgroundColor={"#caced3c7"}
              colorScheme="transparent"
              iconColor="#0000009e"
              width={"20px"}
              h={"20px"}
              alignItems={"center"}
              iconSize={"12px"}
              paddingLeft={"2px"}
              marginTop={"10px"}
            />
            <Text fontWeight={"semibold"} marginTop={"10px"} > Select All</Text>
          </HStack>
        </HStack>
        <Box border={"1px solid #38353565"} h="full" borderRadius="12px" w="100%" overflow={"hidden"}>
          <Table width={"100%"} >
            <Tbody >
              {modules.map((module) => (
                <React.Fragment key={module.moduleName}>
                  <Tr bg="#364261" >
                    <Td width={"55%"} color="white" fontWeight="bold">
                      {module.moduleName}
                    </Td>
                    <Td textAlign="center" margin={"0px"} padding={"0px"} borderLeft={"1px solid #fff"}>
                      <Checkbox
                        isChecked={selectedModules.includes(module.moduleName)}
                        onChange={() => handleCheckbox(module.moduleName)}
                        // isDisabled={module.moduleName === "Overview" || module.moduleName === "Overview Page"}
                        border={"transparent"}
                        borderRadius={"15%"}
                        backgroundColor={"#caced3c7"}
                        colorScheme="transparent"
                        iconColor="#0000009e"
                        width={"20px"}
                        h={"20px"}
                        alignItems={"center"}
                        iconSize={"12px"}
                        paddingLeft={"2px"}
                      />
                    </Td>
                  </Tr>

                  {renderChildren(module.subModules)}
                  {renderChildren(module.components)}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </HStack>
  );
};

export default RoleDetails;
