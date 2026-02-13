import { auth } from "./server/auth";

export default auth((req) => {
    const isAuthenticated = !!req.auth;
    console.log("middle")

    if(!isAuthenticated){
        const newUrl= new URL('/login',req.url);
        return Response.redirect(newUrl);
    }
})

export const config = {
    matcher: ['/'],
}

