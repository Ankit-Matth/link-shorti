import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Links from '@/models/Links';

async function generateUniqueShortKey(length = 6) {
    let key;
    let existingLink;
    do {
        key = Math.random().toString(36).substr(2, length);
        existingLink = await Links.findOne({ shortUrl: key }).select('_id');
    } while (existingLink);
    
    return key;
}


export async function POST(request) {
    try {
        await connectDB();

        const { originalUrl, alias, userEmail } = await request.json();

        if (!originalUrl || !userEmail) {
            return NextResponse.json({ error: 'Original URL and user email are required' }, { status: 400 });
        }
        
        let shortUrlKey;
        const sanitizedAlias = alias ? alias.trim() : null;

        if (sanitizedAlias) {
            const existingLink = await Links.findOne({ shortUrl: sanitizedAlias });
            if (existingLink) {
                return NextResponse.json({ 
                    error: `The custom short URL key "${sanitizedAlias}" is already in use. Please choose another.` 
                }, { status: 409 });
            }
            shortUrlKey = sanitizedAlias;
        } else {
            shortUrlKey = await generateUniqueShortKey(7);
        }
        
        const safeOriginalUrl = originalUrl.startsWith('http') ? originalUrl : `https://${originalUrl}`;


        const newLink = await Links.create({
            userEmail,
            originalUrl: safeOriginalUrl,
            shortUrl: shortUrlKey, 
            alias: sanitizedAlias, 
            clicks: 0,
            createdAt: new Date(),
        });

        return NextResponse.json({ 
            message: 'Link successfully created', 
            newLink 
        }, { status: 201 });

    } catch (error) {
        console.error('Error creating link:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}