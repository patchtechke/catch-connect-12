import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WaitlistFormData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  userType: string;
  country: string;
  description: string;
}

interface WaitlistDialogProps {
  trigger?: React.ReactNode;
  variant?: "default" | "hero" | "nav";
}

export function WaitlistDialog({ trigger, variant = "default" }: WaitlistDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<WaitlistFormData>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    userType: "",
    country: "",
    description: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: WaitlistFormData) => {
      const response = await apiRequest("/api/waitlist", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to the Revolution!",
        description: "You've been added to our waitlist. We'll be in touch soon!",
      });
      setOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        emailAddress: "",
        phoneNumber: "",
        userType: "",
        country: "",
        description: "",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Something went wrong",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.emailAddress) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(formData);
  };

  const handleChange = (field: keyof WaitlistFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button 
      variant={variant === "hero" ? "logo" : variant === "nav" ? "default" : "default"}
      size={variant === "hero" ? "lg" : "default"}
      className={variant === "hero" ? "shadow-3 hover:shadow-4 text-lg px-8" : ""}
      data-testid="button-join-waitlist"
    >
      <Sparkles className="mr-2 h-5 w-5" />
      Join the Waitlist
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Join the Marine Revolution
          </DialogTitle>
          <DialogDescription className="text-base">
            Be among the first to access MarineCatch Africa's platform. 
            Fill out the form below and we'll notify you when we launch in your region.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
                data-testid="input-firstName"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
                data-testid="input-lastName"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address *</Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="you@example.com"
              value={formData.emailAddress}
              onChange={(e) => handleChange("emailAddress", e.target.value)}
              required
              data-testid="input-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+254 700 000 000"
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              data-testid="input-phone"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">I am a...</Label>
            <Select 
              value={formData.userType} 
              onValueChange={(value) => handleChange("userType", value)}
            >
              <SelectTrigger data-testid="select-userType">
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fisher">Fisher / Fishing Community</SelectItem>
                <SelectItem value="buyer">Seafood Buyer / Importer</SelectItem>
                <SelectItem value="processor">Fish Processor</SelectItem>
                <SelectItem value="retailer">Restaurant / Retailer</SelectItem>
                <SelectItem value="investor">Investor / Partner</SelectItem>
                <SelectItem value="ngo">NGO / Development Organization</SelectItem>
                <SelectItem value="government">Government / Regulator</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country / Region</Label>
            <Select 
              value={formData.country} 
              onValueChange={(value) => handleChange("country", value)}
            >
              <SelectTrigger data-testid="select-country">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kenya">Kenya</SelectItem>
                <SelectItem value="tanzania">Tanzania</SelectItem>
                <SelectItem value="uganda">Uganda</SelectItem>
                <SelectItem value="somalia">Somalia</SelectItem>
                <SelectItem value="mozambique">Mozambique</SelectItem>
                <SelectItem value="madagascar">Madagascar</SelectItem>
                <SelectItem value="seychelles">Seychelles</SelectItem>
                <SelectItem value="mauritius">Mauritius</SelectItem>
                <SelectItem value="comoros">Comoros</SelectItem>
                <SelectItem value="south_africa">South Africa</SelectItem>
                <SelectItem value="ghana">Ghana</SelectItem>
                <SelectItem value="nigeria">Nigeria</SelectItem>
                <SelectItem value="senegal">Senegal</SelectItem>
                <SelectItem value="other_africa">Other African Country</SelectItem>
                <SelectItem value="international">International</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Tell us more (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Share any additional details about your interest in MarineCatch Africa..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[80px]"
              data-testid="textarea-description"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            variant="logo"
            disabled={mutation.isPending}
            data-testid="button-submit-waitlist"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Join the Waitlist
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default WaitlistDialog;
