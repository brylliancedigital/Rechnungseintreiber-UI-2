"use client"

import { useState } from "react"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function ConfigurationPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoArchive, setAutoArchive] = useState(false)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("de")
  const [apiKey, setApiKey] = useState("••••••••••••••••")
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook")

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Konfiguration</h1>
          <p className="text-gray-500">Verwalte die Einstellungen des KI-Prozess Dashboards</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="general">Allgemein</TabsTrigger>
            <TabsTrigger value="notifications">Benachrichtigungen</TabsTrigger>
            <TabsTrigger value="api">API & Integrationen</TabsTrigger>
            <TabsTrigger value="appearance">Erscheinungsbild</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Allgemeine Einstellungen</CardTitle>
                  <CardDescription>Konfiguriere die grundlegenden Einstellungen des Dashboards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="language">Sprache</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Sprache auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="de">Deutsch</SelectItem>
                        <SelectItem value="en">Englisch</SelectItem>
                        <SelectItem value="fr">Französisch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zeitzone</Label>
                    <Select defaultValue="europe-berlin">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Zeitzone auswählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe-berlin">Europe/Berlin</SelectItem>
                        <SelectItem value="europe-london">Europe/London</SelectItem>
                        <SelectItem value="america-new_york">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-archive">Automatisches Archivieren</Label>
                      <p className="text-sm text-gray-500">
                        Abgeschlossene Prozesse nach 30 Tagen automatisch archivieren
                      </p>
                    </div>
                    <Switch id="auto-archive" checked={autoArchive} onCheckedChange={setAutoArchive} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Speichern</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Datenmanagement</CardTitle>
                  <CardDescription>Verwalte die Daten des Dashboards</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Datenexport</Label>
                    <p className="text-sm text-gray-500">Exportiere alle Prozessdaten als CSV oder JSON</p>
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline">Als CSV exportieren</Button>
                      <Button variant="outline">Als JSON exportieren</Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-red-600">Gefahrenzone</Label>
                    <p className="text-sm text-gray-500">Lösche alle Daten und setze das Dashboard zurück</p>
                    <Button variant="destructive" className="mt-2">
                      Alle Daten löschen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungseinstellungen</CardTitle>
                <CardDescription>Konfiguriere, wie und wann du Benachrichtigungen erhältst</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications-enabled">Benachrichtigungen aktivieren</Label>
                    <p className="text-sm text-gray-500">Aktiviere oder deaktiviere alle Benachrichtigungen</p>
                  </div>
                  <Switch
                    id="notifications-enabled"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Benachrichtigungskanäle</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">E-Mail-Benachrichtigungen</Label>
                      <p className="text-sm text-gray-500">Erhalte Benachrichtigungen per E-Mail</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      disabled={!notificationsEnabled}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-address">E-Mail-Adresse</Label>
                    <Input
                      id="email-address"
                      placeholder="beispiel@firma.de"
                      disabled={!notificationsEnabled || !emailNotifications}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Benachrichtigungsereignisse</h3>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Switch id="event-process-completed" defaultChecked disabled={!notificationsEnabled} />
                      <Label htmlFor="event-process-completed">Prozess abgeschlossen</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch id="event-process-error" defaultChecked disabled={!notificationsEnabled} />
                      <Label htmlFor="event-process-error">Prozessfehler</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch id="event-new-message" defaultChecked disabled={!notificationsEnabled} />
                      <Label htmlFor="event-new-message">Neue Nachricht</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Speichern</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="api">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>API-Einstellungen</CardTitle>
                  <CardDescription>Verwalte API-Schlüssel und Zugangsdaten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="api-key">API-Schlüssel</Label>
                    <div className="flex gap-2">
                      <Input
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        type="password"
                        className="flex-1"
                      />
                      <Button variant="outline">Anzeigen</Button>
                      <Button variant="outline">Neu generieren</Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Dieser Schlüssel gewährt vollen Zugriff auf die API. Behandle ihn vertraulich.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="webhook-url">Webhook-URL</Label>
                      <Badge variant="outline" className="text-green-600 bg-green-50">
                        Aktiv
                      </Badge>
                    </div>
                    <Input id="webhook-url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} />
                    <p className="text-xs text-gray-500 mt-1">
                      An diese URL werden Ereignisse gesendet, wenn sie eintreten.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Webhook testen</Button>
                  <Button>Speichern</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integrationen</CardTitle>
                  <CardDescription>Verbinde das Dashboard mit externen Diensten</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-md">
                        <svg
                          className="h-6 w-6 text-blue-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path d="M15 12L10 8V16L15 12Z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Slack</h3>
                        <p className="text-sm text-gray-500">Benachrichtigungen an Slack-Kanäle senden</p>
                      </div>
                    </div>
                    <Button variant="outline">Verbinden</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-md">
                        <svg
                          className="h-6 w-6 text-green-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                          <path d="M22 8L12 14L2 8" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">E-Mail</h3>
                        <p className="text-sm text-gray-500">E-Mail-Benachrichtigungen konfigurieren</p>
                      </div>
                    </div>
                    <Button variant="outline">Konfigurieren</Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-md">
                        <svg
                          className="h-6 w-6 text-purple-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M21 7L13 15L9 11L3 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 13V7H15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium">Analytics</h3>
                        <p className="text-sm text-gray-500">Prozessdaten an Analytics-Dienste senden</p>
                      </div>
                    </div>
                    <Button variant="outline">Verbinden</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Erscheinungsbild</CardTitle>
                <CardDescription>Passe das Aussehen des Dashboards an</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Farbschema</Label>
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Farbschema auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Hell</SelectItem>
                      <SelectItem value="dark">Dunkel</SelectItem>
                      <SelectItem value="system">Systemeinstellung</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Akzentfarbe</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-amber-500", "bg-red-500", "bg-gray-500"].map(
                      (color, index) => (
                        <div
                          key={index}
                          className={`${color} h-8 rounded-md cursor-pointer ring-offset-2 ${index === 0 ? "ring-2 ring-blue-600" : ""}`}
                        />
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density">Anzeigedichte</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger id="density">
                      <SelectValue placeholder="Anzeigedichte auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Kompakt</SelectItem>
                      <SelectItem value="comfortable">Komfortabel</SelectItem>
                      <SelectItem value="spacious">Geräumig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-css">Benutzerdefiniertes CSS</Label>
                  <Textarea
                    id="custom-css"
                    placeholder="/* Füge hier dein benutzerdefiniertes CSS ein */"
                    className="font-mono text-sm"
                    rows={5}
                  />
                  <p className="text-xs text-gray-500">
                    Füge benutzerdefiniertes CSS hinzu, um das Aussehen des Dashboards anzupassen.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button>Speichern</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
