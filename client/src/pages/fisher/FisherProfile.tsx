import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { FisherLayout } from "@/components/fisher/FisherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fisherProfileSchema, FisherProfileInput } from "@shared/schema";
import { 
  User, 
  Ship, 
  Anchor, 
  FileText, 
  MapPin, 
  Clock, 
  Package, 
  Globe,
  Save,
  Loader2,
  BadgeCheck,
  Mail,
  Phone,
  Calendar,
  Star,
  Pencil,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const boatTypes = [
  "Trawler",
  "Longliner",
  "Gillnetter",
  "Seiner",
  "Canoe",
  "Dhow",
  "Motorboat",
  "Fishing Vessel",
  "Other",
];

const fishingZones = [
  "Coastal Waters",
  "Deep Sea",
  "Lake Victoria",
  "Lake Tanganyika",
  "Lake Malawi",
  "Indian Ocean",
  "Atlantic Ocean",
  "Freshwater Rivers",
  "Estuaries",
  "Other",
];

const countries = [
  "Kenya",
  "Tanzania",
  "Uganda",
  "Mozambique",
  "Madagascar",
  "South Africa",
  "Nigeria",
  "Ghana",
  "Senegal",
  "Morocco",
  "Other",
];

const regions = [
  "Coast",
  "Central",
  "Northern",
  "Southern",
  "Eastern",
  "Western",
  "Lake Region",
  "Other",
];

function ProfileField({ label, value, icon: Icon }: { label: string; value: string | number | undefined | null; icon?: any }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" />}
        {label}
      </p>
      <p className="font-medium" data-testid={`text-${label.toLowerCase().replace(/\s+/g, '-')}`}>
        {value || "Not specified"}
      </p>
    </div>
  );
}

export default function FisherProfile() {
  const { session, user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const { data: profileData, isLoading: isLoadingProfile } = useQuery<{ profile: any }>({
    queryKey: ["/api/fisher/profile"],
    queryFn: async () => {
      const res = await fetch("/api/fisher/profile", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }
      return res.json();
    },
    enabled: !!session?.accessToken,
  });

  const form = useForm<FisherProfileInput>({
    resolver: zodResolver(fisherProfileSchema),
    defaultValues: {
      boatName: "",
      boatType: "",
      licenseNumber: "",
      fishingZone: "",
      yearsExperience: undefined,
      catchCapacity: undefined,
      country: "",
      region: "",
      port: "",
      bio: "",
    },
  });

  useEffect(() => {
    if (profileData) {
      const profile = profileData.profile;
      if (profile) {
        form.reset({
          boatName: profile.boat_name || "",
          boatType: profile.boat_type || "",
          licenseNumber: profile.license_number || "",
          fishingZone: profile.fishing_zone || "",
          yearsExperience: profile.years_experience || undefined,
          catchCapacity: profile.catch_capacity || undefined,
          country: profile.country || "",
          region: profile.region || "",
          port: profile.port || "",
          bio: profile.bio || "",
        });
      }
    }
  }, [profileData, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: FisherProfileInput) => {
      return apiRequest("/api/fisher/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/stats"] });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FisherProfileInput) => {
    updateMutation.mutate(data);
  };

  const handleCancelEdit = () => {
    if (profileData?.profile) {
      const profile = profileData.profile;
      form.reset({
        boatName: profile.boat_name || "",
        boatType: profile.boat_type || "",
        licenseNumber: profile.license_number || "",
        fishingZone: profile.fishing_zone || "",
        yearsExperience: profile.years_experience || undefined,
        catchCapacity: profile.catch_capacity || undefined,
        country: profile.country || "",
        region: profile.region || "",
        port: profile.port || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoadingProfile) {
    return (
      <FisherLayout breadcrumbs={[{ label: "Settings", href: "/fisher/settings/profile" }, { label: "Profile" }]}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </FisherLayout>
    );
  }

  const profile = profileData?.profile;
  const initials = user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() : '';
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : '';

  return (
    <FisherLayout breadcrumbs={[{ label: "Settings", href: "/fisher/settings/profile" }, { label: "Profile" }]}>
      <div className="space-y-6">
        <Card data-testid="card-profile-header">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatarUrl} alt={`${user?.firstName} ${user?.lastName}`} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold" data-testid="text-user-name">
                    {user?.firstName} {user?.lastName}
                  </h1>
                  {profile?.is_verified && (
                    <Badge variant="default" className="gap-1" data-testid="badge-verified">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {user?.email && (
                    <span className="flex items-center gap-1" data-testid="text-email">
                      <Mail className="h-4 w-4" />
                      {user.email}
                    </span>
                  )}
                  {user?.phoneNumber && (
                    <span className="flex items-center gap-1" data-testid="text-phone">
                      <Phone className="h-4 w-4" />
                      {user.phoneNumber}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {memberSince && (
                    <span className="flex items-center gap-1" data-testid="text-member-since">
                      <Calendar className="h-4 w-4" />
                      Member since {memberSince}
                    </span>
                  )}
                  {profile?.rating !== undefined && profile?.rating > 0 && (
                    <span className="flex items-center gap-1" data-testid="text-rating">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {profile.rating.toFixed(1)} rating
                    </span>
                  )}
                </div>
                {profile?.total_catches !== undefined && (
                  <div className="pt-2">
                    <Badge variant="secondary" data-testid="badge-total-catches">
                      {profile.total_catches} {profile.total_catches === 1 ? 'catch' : 'catches'} posted
                    </Badge>
                  </div>
                )}
              </div>
              <div>
                {!isEditing && (
                  <Button 
                    onClick={() => setIsEditing(true)}
                    data-testid="button-edit-profile"
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {isEditing ? (
          <>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-xl font-semibold" data-testid="text-page-title">Edit Profile</h2>
                <p className="text-muted-foreground">Update your fisher profile information</p>
              </div>
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
                data-testid="button-cancel-edit"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Ship className="h-5 w-5" />
                        Boat Information
                      </CardTitle>
                      <CardDescription>
                        Details about your fishing vessel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="boatName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Boat Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your boat name"
                                {...field}
                                data-testid="input-boat-name"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="boatType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Boat Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-boat-type">
                                  <SelectValue placeholder="Select boat type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {boatTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="licenseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              License Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your license number"
                                {...field}
                                data-testid="input-license-number"
                              />
                            </FormControl>
                            <FormDescription>Your official fishing license number</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="catchCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Package className="h-4 w-4" />
                              Catch Capacity (kg)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 500"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                data-testid="input-catch-capacity"
                              />
                            </FormControl>
                            <FormDescription>Maximum catch capacity in kilograms</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Anchor className="h-5 w-5" />
                        Fishing Details
                      </CardTitle>
                      <CardDescription>
                        Your fishing experience and zones
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="fishingZone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              Fishing Zone
                            </FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-fishing-zone">
                                  <SelectValue placeholder="Select your fishing zone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {fishingZones.map((zone) => (
                                  <SelectItem key={zone} value={zone}>
                                    {zone}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="yearsExperience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Years of Experience
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                placeholder="e.g., 10"
                                {...field}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                                data-testid="input-years-experience"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Location
                      </CardTitle>
                      <CardDescription>
                        Your country, region and port
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-country">
                                  <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || ""}>
                              <FormControl>
                                <SelectTrigger data-testid="select-region">
                                  <SelectValue placeholder="Select region" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {regions.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="port"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Port</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter your home port"
                                {...field}
                                data-testid="input-port"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        About You
                      </CardTitle>
                      <CardDescription>
                        Tell buyers about yourself
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us about yourself, your fishing experience, specialties, and what makes your catches special..."
                                className="resize-none"
                                rows={5}
                                {...field}
                                data-testid="input-bio"
                              />
                            </FormControl>
                            <FormDescription>
                              A compelling bio helps buyers connect with you
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    data-testid="button-cancel-edit-bottom"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    data-testid="button-save-profile"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Profile
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            <div>
              <h2 className="text-xl font-semibold" data-testid="text-page-title">Profile Details</h2>
              <p className="text-muted-foreground">Your fisher profile information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5" />
                    Boat Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProfileField label="Boat Name" value={profile?.boat_name} />
                    <ProfileField label="Boat Type" value={profile?.boat_type} />
                    <ProfileField label="License Number" value={profile?.license_number} icon={FileText} />
                    <ProfileField 
                      label="Catch Capacity" 
                      value={profile?.catch_capacity ? `${profile.catch_capacity} kg` : undefined} 
                      icon={Package} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="h-5 w-5" />
                    Fishing Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ProfileField label="Fishing Zone" value={profile?.fishing_zone} icon={MapPin} />
                    <ProfileField 
                      label="Years of Experience" 
                      value={profile?.years_experience ? `${profile.years_experience} years` : undefined} 
                      icon={Clock} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <ProfileField label="Country" value={profile?.country} />
                    <ProfileField label="Region" value={profile?.region} />
                    <ProfileField label="Port" value={profile?.port} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    About You
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Bio</p>
                    <p className="font-medium whitespace-pre-wrap" data-testid="text-bio">
                      {profile?.bio || "No bio provided yet. Click Edit Profile to add one."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </FisherLayout>
  );
}
