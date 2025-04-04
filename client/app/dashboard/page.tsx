"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight, CheckCircle, ChevronDown, Clock, ExternalLink, XCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { transcribeAudio, extractClaims } from "@/lib/api";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function DashboardPage() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [transcript, setTranscript] = useState("");
  const [claims, setClaims] = useState<string[]>([]);
  const [progress, setProgress] = useState(60); // 0 to 100
  type StatusType = "pending" | "in_progress" | "complete";

  const [status, setStatus] = useState<{
    audio: StatusType;
    transcript: StatusType;
    claims: StatusType;
    verify: StatusType;
  }>({
    audio: "pending",
    transcript: "pending",
    claims: "pending",
    verify: "pending",
  });

  const getStatusText = (status: StatusType) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "in_progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };
  
  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case "complete":
        return "text-lg font-semibold text-green-600";
      case "in_progress":
        return "text-lg font-semibold text-orange-600";
      default:
        return "text-lg font-semibold text-slate-400";
    }
  };
  
  const getStepMessage = (status: { audio: StatusType; transcript: StatusType; claims: StatusType; verify: StatusType }) => {
    if (status.audio === "in_progress") return "Extracting audio from live stream...";
    if (status.transcript === "in_progress") return "Transcribing audio...";
    if (status.claims === "in_progress") return "Detecting claims...";
    if (status.verify === "in_progress") return "Verifying claims...";
    return "Initializing process...";
  };
  
  const handleAnalyze = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setShowResults(false);
  
    // Reset status
    setStatus({
      audio: "in_progress",
      transcript: "pending",
      claims: "pending",
      verify: "pending",
    });
    setProgress(10);
  
    try {
      // Simulate audio extraction complete
      await new Promise((res) => setTimeout(res, 1000)); // simulate delay
      setStatus(prev => ({ ...prev, audio: "complete", transcript: "in_progress" }));
      setProgress(30);
  
      // Step 1: Transcribe Audio
      const transcriptionResponse = await transcribeAudio(url);
      setTranscript(transcriptionResponse.transcription || "No transcript available.");
      setStatus(prev => ({ ...prev, transcript: "complete", claims: "in_progress" }));
      setProgress(60);
  
      // Step 2: Extract Claims
      const claimsResponse = await extractClaims(url); // Pass the URL here
      if (claimsResponse.output_file) {
        const claimsText = await fetch(claimsResponse.output_file).then(res => res.text());
        setClaims(claimsText.split("\n"));
      }
      setStatus(prev => ({ ...prev, claims: "complete", verify: "in_progress" }));
      setProgress(80);
  
      // Simulate verification stage
      await new Promise((res) => setTimeout(res, 1000)); // simulate delay
      setStatus(prev => ({ ...prev, verify: "complete" }));
      setProgress(100);
  
      setShowResults(true);
    } catch (error) {
      console.error("Error processing:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const statusKeys: Array<keyof typeof status> = ["audio", "transcript", "claims", "verify"];
  // Use `statusKeys` to safely index `status` in other parts of the code if needed.

  return (
    <div className="flex flex-col gap-10 p-6 md:p-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Fact Check Dashboard</h1>
        <p className="text-muted-foreground mt-1">Analyze live broadcasts and detect potential misinformation</p>
      </div>

      <Card className="border-orange-100 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl">Analyze Live Broadcasts</CardTitle>
          <CardDescription>Enter a URL to a live broadcast or video stream to analyze in real-time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 sm:flex-row">
            <Input
              placeholder="https://example.com/live-broadcast"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAnalyze}
              disabled={!url || isAnalyzing}
              className="bg-orange-600 hover:bg-orange-700 px-6"
              size="lg"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Live"}
              {!isAnalyzing && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span>Supports live broadcasts</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span>Multiple languages</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span>Secure processing</span>
          </div>
        </CardFooter>
      </Card>

      {isAnalyzing && (
        <Card className="border-orange-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="h-5 w-5 text-orange-600 animate-pulse" />
            Processing Live Broadcast
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-slate-100">
              <div
                className="h-2 animate-pulse rounded-full bg-orange-600"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{getStepMessage(status)}</span>
              <span>{progress}%</span>
            </div>
          </div>
      
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Audio Extraction", key: "audio" as keyof typeof status },
              { label: "Transcription", key: "transcript" as keyof typeof status },
              { label: "Claim Detection", key: "claims" as keyof typeof status },
              { label: "Verification", key: "verify" as keyof typeof status },
            ].map(({ label, key }) => (
              <div key={key} className="rounded-lg border bg-white p-4 text-center">
                <div className="text-sm font-medium text-muted-foreground mb-1">
                  {label}
                </div>
                <div className={getStatusStyle(status[key])}>
                  {getStatusText(status[key])}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>      
      )}

      {showResults && (
        <div className="space-y-8">
          <Card className="border-green-100 shadow-md">
            <CardHeader className="bg-green-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Analysis Results
              </CardTitle>
              <CardDescription>Content analyzed: {url}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="mb-8 flex items-center justify-center">
                <div className="relative flex h-48 w-48 items-center justify-center rounded-full border-8 border-green-100">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-600">87%</div>
                    <div className="text-sm font-medium text-muted-foreground">Reliability Score</div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="claims">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="claims">Claims</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="sources">Sources</TabsTrigger>
                </TabsList>
                <TabsContent value="claims" className="space-y-6 pt-6">
                  {claims.length > 0 ? (
                    claims.map((claim, index) => (
                      <Collapsible key={index} className="border rounded-lg shadow-sm">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-5 font-medium">
                          <div className="flex items-center gap-3">
                            {/* You can dynamically choose icon based on verification status later */}
                            <AlertCircle className="h-5 w-5 text-amber-500" />
                            <span>{claim}</span>
                          </div>
                          <ChevronDown className="h-4 w-4" />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="border-t bg-slate-50 p-5">
                          <p className="text-muted-foreground">
                            {/* Placeholder for now; later you can pull in verification result here */}
                            Verification details coming soon...
                          </p>
                          <div className="mt-4 flex items-center gap-2">
                            <Link href="#" className="text-sm text-orange-600 flex items-center">
                              View sources <ExternalLink className="ml-1 h-3 w-3" />
                            </Link>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))
                  ) : (
                    <div className="text-muted-foreground text-center">No claims extracted yet.</div>
                  )}
                </TabsContent>

                <TabsContent value="transcript" className="pt-6">
                  <Card className="shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex justify-end mb-4">
                        <Button variant="outline" size="sm">
                          Download Transcript
                        </Button>
                      </div>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {transcript.length > 0
                          ? transcript
                          : "Transcript will appear here once audio is transcribed."}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sources" className="space-y-6 pt-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">NASA Global Climate Change</CardTitle>
                        <CardDescription>Official data source</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Official NASA data on global temperature rise and climate indicators
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Link href="#" className="text-sm text-orange-600 flex items-center">
                          Visit source <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">International Energy Agency</CardTitle>
                        <CardDescription>Official data source</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Global energy statistics and renewable energy adoption data
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Link href="#" className="text-sm text-orange-600 flex items-center">
                          Visit source <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">MIT Climate Portal</CardTitle>
                        <CardDescription>Academic source</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Research on electric vehicle lifecycle emissions compared to conventional vehicles
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Link href="#" className="text-sm text-orange-600 flex items-center">
                          Visit source <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">IPCC Sixth Assessment Report</CardTitle>
                        <CardDescription>International organization</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          Comprehensive climate change assessment from the Intergovernmental Panel on Climate Change
                        </p>
                      </CardContent>
                      <CardFooter className="border-t pt-4">
                        <Link href="#" className="text-sm text-orange-600 flex items-center">
                          Visit source <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="border-t bg-slate-50 flex justify-between">
              <Button variant="outline" size="lg">
                Download Report
              </Button>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Link href="/dashboard/analytics">View Analytics</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">Settings</CardTitle>
              <CardDescription>Configure your analysis preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">Hindi</SelectItem>
                        <SelectItem value="bn">Bengali</SelectItem>
                        <SelectItem value="ta">Tamil</SelectItem>
                        <SelectItem value="te">Telugu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sources">Preferred Sources</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="sources">
                        <SelectValue placeholder="Select sources" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="gov">Government Sources</SelectItem>
                        <SelectItem value="academic">Academic Sources</SelectItem>
                        <SelectItem value="news">News Sources</SelectItem>
                        <SelectItem value="fact-check">Fact-Checking Organizations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="confidence">Minimum Confidence Threshold</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger id="confidence">
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High (90%+)</SelectItem>
                        <SelectItem value="medium">Medium (75%+)</SelectItem>
                        <SelectItem value="low">Low (50%+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-format">Report Format</Label>
                    <Select defaultValue="detailed">
                      <SelectTrigger id="report-format">
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="summary">Summary</SelectItem>
                        <SelectItem value="executive">Executive Brief</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-analyze">Automatic Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically analyze new content from trusted sources
                    </p>
                  </div>
                  <Switch id="auto-analyze" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications when analysis is complete
                    </p>
                  </div>
                  <Switch id="notifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="archive">Archive Results</Label>
                    <p className="text-sm text-muted-foreground">Save analysis results for future reference</p>
                  </div>
                  <Switch id="archive" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-end gap-4">
              <Button variant="outline">Reset to Defaults</Button>
              <Button className="bg-orange-600 hover:bg-orange-700">Save Settings</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {!isAnalyzing && !showResults && (
        <div className="space-y-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Recent Analyses</CardTitle>
                <CardDescription>Your recent fact-checking activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-slate-50 p-6 text-center">
                  <Image
                    src="/placeholder.svg?height=80&width=80"
                    alt="Empty state"
                    width={80}
                    height={80}
                    className="mx-auto mb-4"
                  />
                  <p className="text-sm text-muted-foreground mb-4">You haven't analyzed any content yet.</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View History
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Tips</CardTitle>
                <CardDescription>Get the most out of Nirnay</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Use complete URLs</p>
                      <p className="text-sm">Enter a full URL including https://</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Ensure clear audio</p>
                      <p className="text-sm">Analysis works best with clear audio quality</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-green-600 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Longer content</p>
                      <p className="text-sm">Longer content provides more accurate results</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Settings</CardTitle>
                <CardDescription>Configure your preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="language-quick">Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger id="language-quick" className="w-[140px]">
                      <SelectValue placeholder="Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="bn">Bengali</SelectItem>
                      <SelectItem value="ta">Tamil</SelectItem>
                      <SelectItem value="te">Telugu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="threshold-quick">Confidence Threshold</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger id="threshold-quick" className="w-[140px]">
                      <SelectValue placeholder="Threshold" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="notifications-quick">Notifications</Label>
                  </div>
                  <Switch id="notifications-quick" defaultChecked />
                </div>
              </CardContent>
              <CardFooter className="border-t">
                <Button variant="ghost" size="sm" className="w-full">
                  Advanced Settings
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card className="shadow-sm bg-orange-50 border-orange-100">
            <CardHeader>
              <CardTitle className="text-xl">Getting Started with Nirnay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2 items-center">
                <div>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Welcome to Nirnay, India's premier platform for live broadcast verification and fact-checking.
                      Follow these steps to get started:
                    </p>
                    <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
                      <li>Enter a URL to a live broadcast or video stream in the analysis box above</li>
                      <li>Click "Analyze Live" and wait for our AI to process the content in real-time</li>
                      <li>Review the claims, transcript, and sources in the detailed report</li>
                      <li>Check the analytics for deeper insights into content reliability</li>
                      <li>Configure your settings to customize your experience</li>
                    </ol>
                    <div className="pt-2">
                      <Button className="bg-orange-600 hover:bg-orange-700">Watch Tutorial Video</Button>
                    </div>
                  </div>
                </div>
                <div className="relative h-[250px] rounded-lg overflow-hidden shadow-md">
                <video
                  src="/Nirnay - tutorial.mp4"
                  width={800}
                  height={500}
                  className="object-cover w-full h-full rounded-lg shadow-md"
                  controls
                  controlsList="nodownload"
                  disablePictureInPicture
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-white/80 p-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-orange-600"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

