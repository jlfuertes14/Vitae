import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import puppeteer from "puppeteer";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Require authentication
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const resumeId = searchParams.get("id");

    if (!resumeId) {
      return NextResponse.json({ error: "Resume ID is required" }, { status: 400 });
    }

    // Launch puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Construct the print URL. For local dev it's localhost:3000
    // In production, we'd use the deployed URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const printUrl = `${appUrl}/resumes/${resumeId}/print`;

    // We must pass the session cookie if the print route is protected
    // For this MVP, we assume the print route might be unprotected for internal headless chrome
    // or we pass a signed token. We'll just navigate to it.
    
    await page.goto(printUrl, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    await browser.close();

    return new Response(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="resume-${resumeId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("[PDF_EXPORT_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
