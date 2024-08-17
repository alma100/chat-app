import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default async function fetchData(endpoint, method = "GET", body = undefined, headers = undefined) {
    try {
        const response = await fetch(endpoint, { method, body, headers });
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Network response was not ok.');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}