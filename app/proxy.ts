import { NextResponse, type NextRequest } from "next/server";

// ALPHA FERMÉE : tout le site demande un identifiant et un mot de passe.
// Désactivé automatiquement si ALPHA_PASSWORD n'est pas défini (par exemple sur ton ordinateur).
//
// Sur Vercel : Settings > Environment Variables
//   ALPHA_USER      = le nom d'utilisateur à donner aux testeurs (lettres sans accents)
//   ALPHA_PASSWORD  = un mot de passe long, sans accents
export function proxy(request: NextRequest) {
  const password = process.env.ALPHA_PASSWORD;
  if (!password) return NextResponse.next();

  const user = process.env.ALPHA_USER ?? "alpha";
  const header = request.headers.get("authorization");

  if (header?.startsWith("Basic ")) {
    const [givenUser, ...rest] = atob(header.slice(6)).split(":");
    if (givenUser === user && rest.join(":") === password) return NextResponse.next();
  }

  return new NextResponse("Accès réservé aux testeurs d’Akeñ.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Akeñ alpha", charset="UTF-8"' },
  });
}

// Tout le site, sauf les fichiers internes de Next.js
export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
