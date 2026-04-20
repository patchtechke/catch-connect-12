import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { FisherLayout } from "@/components/fisher/FisherLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState, useRef } from "react";
import { Link } from "wouter";
import {
  Fish,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Package,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Scale,
  ImagePlus,
  Camera,
  Upload,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const fishSpecies = [
  "Tilapia", "Nile Perch", "Catfish", "Sardines", "Mackerel", "Tuna",
  "Red Snapper", "Sea Bass", "Grouper", "Crab", "Lobster", "Shrimp",
  "Squid", "Octopus", "Other",
];

const qualityGrades = ["Premium", "Grade A", "Grade B", "Standard"];

export default function FisherCatches() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCatch, setSelectedCatch] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const { data: catchesData, isLoading } = useQuery({
    queryKey: ["/api/fisher/catches"],
    enabled: !!session?.accessToken,
    queryFn: async () => {
      const res = await fetch("/api/fisher/catches", {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch catches");
      return res.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (catchId: string) => {
      return apiRequest(`/api/fisher/catches/${catchId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/catches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/marketplace"] });
      setDeleteDialogOpen(false);
      setSelectedCatch(null);
      toast({
        title: "Catch deleted",
        description: "The catch has been removed from the marketplace.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete catch. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return apiRequest(`/api/fisher/catches/${id}`, {
        method: "PUT",
        headers: { 
          Authorization: `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/catches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/fisher/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/buyer/marketplace"] });
      setEditDialogOpen(false);
      setSelectedCatch(null);
      toast({
        title: "Catch updated",
        description: "Your catch has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update catch. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      const newUrls = [...imageUrls, ...uploadedUrls];
      setImageUrls(newUrls);
      setEditForm({ ...editForm, imageUrls: newUrls });
      
      toast({
        title: "Images uploaded",
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload one or more images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (cameraInputRef.current) cameraInputRef.current.value = "";
    }
  };

  const removeImageUrl = (index: number) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newUrls);
    setEditForm({ ...editForm, imageUrls: newUrls });
  };

  const openViewDialog = (catchItem: any) => {
    setSelectedCatch(catchItem);
    setViewDialogOpen(true);
  };

  const openEditDialog = (catchItem: any) => {
    setSelectedCatch(catchItem);
    setEditForm({
      species: catchItem.species,
      quantity: catchItem.quantity,
      unit: catchItem.unit,
      pricePerUnit: catchItem.price_per_unit,
      currency: catchItem.currency,
      quality: catchItem.quality || "Standard",
      catchDate: catchItem.catch_date?.split("T")[0] || "",
      location: catchItem.location || "",
      description: catchItem.description || "",
      imageUrls: catchItem.image_urls || [],
    });
    setImageUrls(catchItem.image_urls || []);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (catchItem: any) => {
    setSelectedCatch(catchItem);
    setDeleteDialogOpen(true);
  };

  const handleUpdateSubmit = () => {
    if (!selectedCatch) return;
    updateMutation.mutate({
      id: selectedCatch.id,
      data: editForm,
    });
  };

  const catches = catchesData?.catches || [];
  
  const filteredCatches = catches.filter((catchItem: any) => {
    const matchesSearch = catchItem.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         catchItem.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ||
                         (filterStatus === "available" && catchItem.is_available) ||
                         (filterStatus === "sold" && !catchItem.is_available);
    return matchesSearch && matchesFilter;
  });

  const totalCatches = catches.length;
  const activeCatches = catches.filter((c: any) => c.is_available).length;
  const soldCatches = catches.filter((c: any) => !c.is_available).length;

  return (
    <FisherLayout breadcrumbs={[{ label: "Catches" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">My Catches</h1>
            <p className="text-muted-foreground">Manage your fish listings and inventory</p>
          </div>
          <Button asChild data-testid="button-add-catch">
            <Link href="/fisher/catches/add">
              <Plus className="h-4 w-4 mr-2" />
              Add New Catch
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Total Catches</CardTitle>
              <Fish className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-catches">{totalCatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500" data-testid="text-active-catches">{activeCatches}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <CardTitle className="text-sm font-medium">Sold Items</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-sold-catches">{soldCatches}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <CardTitle>Catch Listings</CardTitle>
                <CardDescription>View and manage all your fish listings</CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search catches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-[200px]"
                    data-testid="input-search"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]" data-testid="select-filter">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Catches</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredCatches.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Species</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCatches.map((catchItem: any) => (
                    <TableRow key={catchItem.id} data-testid={`catch-row-${catchItem.id}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {catchItem.image_urls && catchItem.image_urls.length > 0 ? (
                            <div className="h-8 w-8 rounded overflow-hidden">
                              <img 
                                src={catchItem.image_urls[0]} 
                                alt={catchItem.species}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                              <Fish className="h-4 w-4 text-primary" />
                            </div>
                          )}
                          {catchItem.species}
                        </div>
                      </TableCell>
                      <TableCell>
                        {catchItem.quantity} {catchItem.unit}
                      </TableCell>
                      <TableCell>
                        {catchItem.currency} {catchItem.price_per_unit}/{catchItem.unit}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{catchItem.quality || "Standard"}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {catchItem.location || "Not specified"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={catchItem.is_available ? "default" : "secondary"}>
                          {catchItem.is_available ? "Available" : "Sold"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {catchItem.catch_date
                          ? new Date(catchItem.catch_date).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-actions-${catchItem.id}`}>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => openViewDialog(catchItem)}
                              data-testid={`button-view-${catchItem.id}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => openEditDialog(catchItem)}
                              data-testid={`button-edit-${catchItem.id}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => openDeleteDialog(catchItem)}
                              data-testid={`button-delete-${catchItem.id}`}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No catches found</p>
                <p className="text-sm mb-4">
                  {searchTerm || filterStatus !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Start by adding your first catch"}
                </p>
                {!searchTerm && filterStatus === "all" && (
                  <Button asChild>
                    <Link href="/fisher/catches/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Catch
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5" />
              {selectedCatch?.species}
            </DialogTitle>
            <DialogDescription>
              Catch details and information
            </DialogDescription>
          </DialogHeader>
          {selectedCatch && (
            <div className="space-y-6">
              {selectedCatch.image_urls && selectedCatch.image_urls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedCatch.image_urls.map((url: string, index: number) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden bg-muted">
                      <img
                        src={url}
                        alt={`${selectedCatch.species} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Scale className="h-4 w-4" /> Quantity
                  </p>
                  <p className="font-medium">{selectedCatch.quantity} {selectedCatch.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> Price
                  </p>
                  <p className="font-medium">{selectedCatch.currency} {selectedCatch.price_per_unit}/{selectedCatch.unit}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Award className="h-4 w-4" /> Quality
                  </p>
                  <p className="font-medium">{selectedCatch.quality || "Standard"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Location
                  </p>
                  <p className="font-medium">{selectedCatch.location || "Not specified"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Catch Date
                  </p>
                  <p className="font-medium">
                    {selectedCatch.catch_date 
                      ? new Date(selectedCatch.catch_date).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedCatch.is_available ? "default" : "secondary"}>
                    {selectedCatch.is_available ? "Available" : "Sold"}
                  </Badge>
                </div>
              </div>

              {selectedCatch.description && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm whitespace-pre-wrap">{selectedCatch.description}</p>
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                <p>Created: {new Date(selectedCatch.created_at).toLocaleString()}</p>
                {selectedCatch.updated_at && (
                  <p>Last updated: {new Date(selectedCatch.updated_at).toLocaleString()}</p>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setViewDialogOpen(false);
              openEditDialog(selectedCatch);
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Catch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Catch
            </DialogTitle>
            <DialogDescription>
              Update your catch information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species</Label>
                <Select 
                  value={editForm.species || ""} 
                  onValueChange={(value) => setEditForm({ ...editForm, species: value })}
                >
                  <SelectTrigger data-testid="edit-select-species">
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    {fishSpecies.map((species) => (
                      <SelectItem key={species} value={species}>{species}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select 
                  value={editForm.quality || ""} 
                  onValueChange={(value) => setEditForm({ ...editForm, quality: value })}
                >
                  <SelectTrigger data-testid="edit-select-quality">
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityGrades.map((grade) => (
                      <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={editForm.quantity || ""}
                  onChange={(e) => setEditForm({ ...editForm, quantity: parseFloat(e.target.value) || 0 })}
                  data-testid="edit-input-quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select 
                  value={editForm.unit || ""} 
                  onValueChange={(value) => setEditForm({ ...editForm, unit: value })}
                >
                  <SelectTrigger data-testid="edit-select-unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="crates">Crates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit">Price per Unit</Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="1"
                  value={editForm.pricePerUnit || ""}
                  onChange={(e) => setEditForm({ ...editForm, pricePerUnit: parseFloat(e.target.value) || 0 })}
                  data-testid="edit-input-price"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={editForm.currency || ""} 
                  onValueChange={(value) => setEditForm({ ...editForm, currency: value })}
                >
                  <SelectTrigger data-testid="edit-select-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="TZS">TZS - Tanzanian Shilling</SelectItem>
                    <SelectItem value="UGX">UGX - Ugandan Shilling</SelectItem>
                    <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                    <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="catchDate">Catch Date</Label>
                <Input
                  id="catchDate"
                  type="date"
                  value={editForm.catchDate || ""}
                  onChange={(e) => setEditForm({ ...editForm, catchDate: e.target.value })}
                  data-testid="edit-input-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editForm.location || ""}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  placeholder="e.g., Lake Victoria, Kisumu"
                  data-testid="edit-input-location"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editForm.description || ""}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Describe your catch..."
                className="resize-none"
                rows={3}
                data-testid="edit-input-description"
              />
            </div>

            <div className="space-y-2">
              <Label>Images</Label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              
              <div className="flex gap-2 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => cameraInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  Take Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  Upload
                </Button>
              </div>

              {imageUrls.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden bg-muted border">
                        <img
                          src={url}
                          alt={`Catch image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImageUrl(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                  <ImagePlus className="h-6 w-6 mx-auto mb-1 opacity-50" />
                  <p>No images</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateSubmit}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Catch</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this catch? This action cannot be undone.
              {selectedCatch && (
                <span className="block mt-2 font-medium">
                  {selectedCatch.species} - {selectedCatch.quantity} {selectedCatch.unit}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedCatch && deleteMutation.mutate(selectedCatch.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </FisherLayout>
  );
}
