import React from "react";
import {
    Text,
    HStack,
} from "@chakra-ui/react";


const Footer = () => {
    return (
        <HStack w={"100%"} justifyContent={"center"} position={"absolute"} marginBlock={"3rem 1rem"}>
            <Text fontWeight={"bold"} fontSize={"15px"} color={"#282323"}>
                All Rights Reserved
            </Text>
            <Text>
                @{new Date().getFullYear()}
            </Text>
        </HStack>
    );
};

export default Footer;
