import {NextResponse} from "next/server";
import type { NextRequest } from 'next/server'


export function middleware(req: NextRequest) {
    console.log("Middleware exécuté !");
    const token = req.headers.get('authorization');
    console.log("Token !", token);

    const isAuthPage = req.nextUrl.pathname === '/';

    if (!token && !isAuthPage && !req.nextUrl.searchParams.has('redirectTed')) {
        const loginUrl = new URL("/", req.url)
        loginUrl.searchParams.set("redirected", "true");

        return NextResponse.redirect(loginUrl)
    }
    if (token && isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }
}