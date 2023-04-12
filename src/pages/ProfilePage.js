import { useEffect, useState} from "react";
import { Helmet } from 'react-helmet-async';
// @mui
import {
  Card,
  Container,
} from '@mui/material';



export default function ProfilePage() {
    const [data, setData] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/accounts/profile/', {
            credentials: 'include',
        })
            .then((res) => res.json())
            .then(data => {
                setData(data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <Helmet>
                <title> Profile | Tripper </title>
            </Helmet>

            <Container>
                <Card>
                    {data ? (
                        <>
                            <div>User ID: {data.id}</div>
                            <div>Username: {data.username}</div>
                            <div>First Name: {data.first_name}</div>
                            <div>Last Name: {data.last_name}</div>
                            <div>Email: {data.email}</div>
                            {/* Display other profile data here */}
                        </>
                    ) : (
                        <div>Loading profile data...</div>
                    )}
                </Card>
            </Container>
        </>
    );
}
