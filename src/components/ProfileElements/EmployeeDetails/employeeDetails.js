import React, { useEffect, useState } from 'react'
import { Text, Box, HStack, VStack, TableContainer, Thead, Tbody, Th, Tr, Td, Table } from '@chakra-ui/react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EmployeeDetails = ( {employees = []} ) => {
    // const employee = [
    //     {
    //         ID: '1', Name: "Person1", Role: "SalesMan", Phone: "9876543210",
    //         Email: "person1@gmail.com", Status: true, Adsfree: true
    //     },
    //     {
    //         ID: '2', Name: "Person2", Role: "Admin", Phone: "9876543210",
    //         Email: "person2@gmail.com", Status: true, Adsfree: true
    //     },
    //     {
    //         ID: '3', Name: "Person3", Role: "Delivery", Phone: "9876543210",
    //         Email: "person3@gmail.com", Status: true, Adsfree: false
    //     },
    //     {
    //         ID: '4', Name: "Person4", Role: "Manager", Phone: "9876543210",
    //         Email: "person4@gmail.com", Status: false, Adsfree: true
    //     }
    // ]

    // const {id} = useParams();
    // const [employees, setEmployees] = useState([]);

    // const fetchEmployee = async (id) => {
    //     const response = await axios.get(``, {
    //   headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
    // });
    //     const data = response.data;
    //     setEmployees(data);
    // }

    // useEffect(() =>{
    //     fetchEmployee(id);
    // }, [id])

    return (
        <HStack height={"500px"} align={"start"} marginTop={"3rem"}>
            <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                <Box width="1px" height="full" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack paddingBottom={"5rem"} id='documents-upload' align={"start"} w="full" marginTop={"3rem"}>
                {/* Heading & Subheading */}
                <VStack align={"start"} gap={0} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>Employee Details</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>User Details</Text>
                </VStack>

                <TableContainer mt="1.5rem" border={"1px solid #D0D5DD"} maxWidth={"930px"} maxHeight={"350px"} overflowX={"auto"} overflowY={"auto"} borderRadius={0}>
                    <Table size={"sm"}> 
                        <Thead  variant="simple">
                            <Tr fontWeight={"normal"} backgroundColor={"#364261"}>
                                <Th pl={"5px"} fontWeight={"normal"} p={1} textAlign={"center"} fontSize={"12px"} maxWidth={"80px"} color="#ffffff">Employee ID</Th>
                                <Th fontWeight={"normal"} fontSize={"12px"}  maxWidth={"70px"} color="#ffffff">Employee Name</Th>
                                <Th fontWeight={"normal"} fontSize={"12px"} maxWidth={"70px"} color="#ffffff" >Employee Role</Th>
                                <Th fontWeight={"normal"} fontSize={"12px"}  maxWidth={"50px"} color="#ffffff">Phone</Th>
                                <Th fontWeight={"normal"} fontSize={"12px"} maxWidth={"70px"} color="#ffffff">Email</Th>
                                <Th fontWeight={"normal"} fontSize={"12px"} maxWidth={"70px"} color="#ffffff">Status</Th>
                                <Th pr={"5px"} paddingX={0} fontWeight={"normal"} fontSize={"12px"} maxWidth={"70px"} color="#ffffff">Ads Free</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {employees.map((emp) => {
                                return (
                                    <Tr key={emp.empCode}>
                                        <Td fontSize={"12px"}>{emp.empCode}</Td>
                                        <Td fontSize={"12px"}>{emp.empName}</Td>
                                        <Td fontSize={"12px"}>{emp.role}</Td>
                                        <Td paddingX={"0"} fontSize={"12px"}> {emp.empPhone} </Td>
                                        <Td fontSize={"12px"} textAlign={"start"}>{emp.empEmail}</Td>
                                        <Td fontSize={"12px"} > <Box
                                            bg={emp.empStatus=== "Active" ? "#74cc5f2b" : "#CC5F5F2B"}
                                            color={emp.empStatus=== "Active"? "#519C66" :"#DE904B"}
                                            fontSize="10px" fontWeight="500" borderRadius="12px"
                                            textAlign="center" paddingX={"5px"}>
                                            {emp.empStatus === "Active"? "Active" : "Inactive"}
                                        </Box> </Td>
                                        <Td textAlign={"center"} paddingX={0} fontSize={"12px"}> {emp.addFree ? "Yes" : "No"} </Td>
                                    </Tr>
                                );
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
            </VStack>
        </HStack>
    )
}

export default EmployeeDetails
