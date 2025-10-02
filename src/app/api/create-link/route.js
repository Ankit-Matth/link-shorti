// File: /api/links/create/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Links from '@/models/Links';

export async function POST(request) {
    try {
        await connectDB();

        const { originalUrl, customAlias, userEmail } = await request.json();

        if (!originalUrl || !userEmail) {
            return NextResponse.json({ error: 'Original URL and user email are required' }, { status: 400 });
        }
        
        // 1. Generate a short URL key (alias)
        let shortUrlKey = customAlias || Math.random().toString(36).substr(2, 6);
        
        // 2. Check if alias already exists (for custom alias only)
        if (customAlias) {
            const existingLink = await Links.findOne({ shortUrl: shortUrlKey });
            if (existingLink) {
                return NextResponse.json({ error: 'Custom alias already in use' }, { status: 409 });
            }
        }
        
        // Ensure URL has a protocol for the redirect logic, if missing (optional)
        const safeOriginalUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`;


        // 3. Create the new link document
        const newLink = await Links.create({
            userEmail,
            originalUrl: safeOriginalUrl,
            shortUrl: shortUrlKey,
            clicks: 0,
            createdAt: new Date(),
        });

        // 4. Return the new link object
        return NextResponse.json({ 
            message: 'Link successfully created', 
            newLink 
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}