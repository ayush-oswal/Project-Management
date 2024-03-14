"use client"

import React, { useEffect, useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { GET_ALL_PROJECTS, GET_EMPLOYEE } from '@/queries';





const Page = () => {
  const [name, setName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [id, setId] = useState("");
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [isClientModalOpen, setClientModalOpen] = useState(false);
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeePassword, setEmployeePassword] = useState("");
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {

    const storedName = localStorage.getItem("name");
    const storedIsAdmin = localStorage.getItem("isAdmin") === "true";
    const storedId = localStorage.getItem("id");
    setName(storedName || "");
    setIsAdmin(storedIsAdmin);
    setId(storedId || "");

    async function getProjects() {
      if(storedIsAdmin){
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: GET_ALL_PROJECTS,
            variableValues: {}
          }),
        });
        await response.json().then(res=>{setProjects(res.data.projects)})
      }
      else{
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            source: GET_EMPLOYEE,
            variableValues: {
              id:storedId
            }
          }),
        });
        await response.json().then(res=>{setProjects(res.data.employee.projects)})
      }
      // console.log(projects)
    }
    getProjects()

  }, []);


  const handleClientSubmit = () => {
    // Handle client submission logic here
    console.log("Client Name:", clientName);
    setClientModalOpen(false);
    setClientName("")
  };


  const handleEmployeeSubmit = () => {
    // Handle employee submission logic here
    console.log("Employee Name:", employeeName);
    console.log("Employee Password:", employeePassword);
    setEmployeeModalOpen(false);
    setEmployeeName("")
    setEmployeePassword("")
  };

  //Implement search from blogit

  const handleSearch = () => {

  }

  return (
    <div className='w-full h-full flex flex-col bg-white p-4 rounded-md opacity-70'>
      <div className={`w-full flex items-center ${isAdmin ? 'justify-between' : 'justify-center'}`}>
        <div className="md:hidden">
          {isAdmin && (
            <button className="block text-gray-500 m-2 focus:outline-none" onClick={() => setDrawerOpen(true)}>
              Menu
            </button>
          )}
        </div>
        <div className="hidden md:block">
          {isAdmin && (
            <div>
              <button
                className='m-2 p-2 bg-lime-500 text-white rounded-md'
                onClick={() => setClientModalOpen(true)}
              >
                + Add Client
              </button>
              <button
                className='m-2 p-2 bg-blue-500 text-white rounded-md'
                onClick={() => setEmployeeModalOpen(true)}
              >
                + Add Employee
              </button>
            </div>
          )}
        </div>
        <div className={`lg:w-6/12 ${!isAdmin && 'text-center'}`}>
          <input
            className='p-2 w-full box-border border-black rounded-md bg-slate-300'
            type='text'
            placeholder='Search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {isAdmin && (
          <div className="hidden md:block">
            <button className='m-2 p-2 bg-red-500 text-white rounded-md'>
              + New Project
            </button>
          </div>
        )}
      </div>
      <div className='w-full'></div>

      {/* Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="left"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Items</DrawerHeader>

          <DrawerBody>
            {isAdmin && (
              <>
                <Button
                  colorScheme="green"
                  className='m-2 p-2 rounded-md'
                  onClick={() => setClientModalOpen(true)}
                >
                  + Add Client
                </Button>
                <Button
                  colorScheme="blue"
                  className='m-2 p-2 rounded-md'
                  onClick={() => setEmployeeModalOpen(true)}
                >
                  + Add Employee
                </Button>
                <Button
                  colorScheme="red"
                  className='m-2 p-2 rounded-md'
                >
                  + New Project
                </Button>
              </>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Client Modal */}
      <Modal isOpen={isClientModalOpen} onClose={() => setClientModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Client</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Client Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleClientSubmit}>
              Submit
            </Button>
            <Button onClick={() => setClientModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Employee Modal */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setEmployeeModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Employee</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Employee Name"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <Input
              mt={4}
              type="password"
              placeholder="Password"
              value={employeePassword}
              onChange={(e) => setEmployeePassword(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEmployeeSubmit}>
              Submit
            </Button>
            <Button onClick={() => setEmployeeModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Page;
