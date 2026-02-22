<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { Camera, Check, Lock, PenLine, Shield } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { CircleStencil, Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import { toast } from 'vue-sonner';

// Get API URL from env or default
// const apiUrl = import.meta.env.VITE_API_URL || 'https://app.ytrc.co.th';

const authStore = useAuthStore();
const isLoading = ref(false);
const isUploading = ref(false);
const isCheckingEmployeeId = ref(false);
const employeeIdError = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// Profile Edit Logic
const isEditingProfile = ref(false);

// PIN Logic
const showPinDialog = ref(false);
const showSignatureDialog = ref(false);
const showPasswordDialog = ref(false);
const isSavingPin = ref(false);
const pinData = ref({ pin: '', confirmPin: '' });
const hasPin = computed(() => !!authStore.user?.pinCode); // Assuming backend sends a boolean or we check existence

const handleSavePin = async () => {
  if (pinData.value.pin.length < 4) {
    toast.error('PIN must be at least 4 digits');
    return;
  }
  if (pinData.value.pin !== pinData.value.confirmPin) {
    toast.error('PINs do not match');
    return;
  }

  isSavingPin.value = true;
  try {
    await api.patch(`/users/${authStore.user?.id}`, {
      pinCode: pinData.value.pin,
    });
    toast.success('PIN updated successfully');
    showPinDialog.value = false;
    pinData.value = { pin: '', confirmPin: '' };
    await authStore.fetchUser();
  } catch (error) {
    toast.error('Failed to update PIN');
  } finally {
    isSavingPin.value = false;
  }
};

// Password Logic
const passwordData = ref({ oldPassword: '', newPassword: '', confirmPassword: '' });
const errorMsg = ref('');

const handleSavePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    errorMsg.value = "Passwords don't match";
    return;
  }
  if (passwordData.value.newPassword.length < 8) {
    errorMsg.value = 'Password must be at least 8 characters';
    return;
  }
  
  errorMsg.value = '';
  isLoading.value = true;
  try {
    const token = authStore.tempToken || localStorage.getItem('token');
    if (!token) throw new Error('Session expired');

    await api.post(
      '/auth/change-password',
      {
        oldPassword: passwordData.value.oldPassword,
        newPassword: passwordData.value.newPassword,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Password changed successfully');
    showPasswordDialog.value = false;
    passwordData.value = { oldPassword: '', newPassword: '', confirmPassword: '' };
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || err.message || 'Failed to change password';
  } finally {
    isLoading.value = false;
  }
};

// Cropper Logic
const showCropDialog = ref(false);
const cropImageSrc = ref('');
const cropperRef = ref<any>(null);
const selectedFileType = ref(''); // Store original file type
const StencilComponent = CircleStencil;

// Form Data - Initialize with store data
const formData = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
  firstName: authStore.user?.firstName || '',
  lastName: authStore.user?.lastName || '',
  displayName: authStore.user?.displayName || '',
  employeeId: authStore.user?.employeeId || '',
  signatureText: authStore.user?.signatureText || '',
  signatureStyle: authStore.user?.signatureStyle || 'Caveat',
});

// Watch for authStore user changes and update formData
watch(() => authStore.user, (newUser: any) => {
  if (newUser) {
    formData.value.username = newUser.username || '';
    formData.value.email = newUser.email || '';
    formData.value.firstName = newUser.firstName || '';
    formData.value.lastName = newUser.lastName || '';
    formData.value.displayName = newUser.displayName || '';
    formData.value.employeeId = newUser.employeeId || '';
    formData.value.signatureText = newUser.signatureText || '';
    formData.value.signatureStyle = newUser.signatureStyle || 'Caveat';
  }
}, { immediate: true, deep: true });

const signatureFonts = [
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Great Vibes', family: "'Great Vibes', cursive" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Satisfy', family: "'Satisfy', cursive" },
  { name: 'Pinyon Script', family: "'Pinyon Script', cursive" },
  { name: 'Marck Script', family: "'Marck Script', cursive" },
  { name: 'Courgette', family: "'Courgette', cursive" },
  { name: 'Meow Script', family: "'Meow Script', cursive" },
  { name: 'Sacramento', family: "'Sacramento', cursive" },
];

const userInitials = () => {
  if (!authStore.user?.firstName) return 'U';
  return `${authStore.user.firstName.charAt(0)}${authStore.user.lastName ? authStore.user.lastName.charAt(0) : ''}`;
};

const handleSaveProfile = async () => {
  isLoading.value = true;
  try {
    // Pre-check employeeId uniqueness to provide immediate feedback
    const newEmployeeId = formData.value.employeeId?.trim();
    if (newEmployeeId) {
      isCheckingEmployeeId.value = true;
      employeeIdError.value = '';
      try {
        const res = await api.get(`/users/employee/${encodeURIComponent(newEmployeeId)}/exists`);
        if (res.data?.exists && res.data.userId !== authStore.user?.id) {
          employeeIdError.value = 'Employee ID already in use';
          toast.error('Employee ID already in use');
          isCheckingEmployeeId.value = false;
          isLoading.value = false;
          return;
        }
      } catch (err) {
        // If check fails, log but continue to attempt update (backend will still enforce uniqueness)
        console.warn('Employee ID existence check failed, proceeding to update', err);
      } finally {
        isCheckingEmployeeId.value = false;
      }
    }
    // Simulate API call for profile update (separate from avatar)
    await api.patch(`/users/${authStore.user?.id}`, {
      firstName: formData.value.firstName,
      lastName: formData.value.lastName,
      displayName: formData.value.displayName,
      employeeId: formData.value.employeeId,
      signatureText: formData.value.signatureText,
      signatureStyle: formData.value.signatureStyle,
    });

    await authStore.fetchUser(); // Refresh local data
    toast.success('Profile updated successfully');
    isEditingProfile.value = false;
  } catch (error) {
    const msg = (error as any)?.response?.data?.message || (error as any)?.message || 'Failed to update profile';
    toast.error(msg);
  } finally {
    isLoading.value = false;
  }
};

const handleSaveSignature = async () => {
  if (!formData.value.signatureText || !formData.value.signatureStyle) {
    toast.error('Please provide a signature name and select a style.');
    return;
  }

  if (!authStore.user?.employeeId) {
    toast.error('Please set your Employee ID in your profile first.');
    return;
  }

  isLoading.value = true;
  try {
    // Generate Base64 from Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not initialize canvas context');

    // Fill background with transparent
    ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the chosen font family correctly mapped
    const fontInfo = signatureFonts.find(f => f.name === formData.value.signatureStyle);
    const fontFamily = fontInfo?.family.split(',')[0].replace(/['"]/g, '') || formData.value.signatureStyle;

    // Wait for the font to load to ensure it renders correctly on canvas
    await document.fonts.load(`80px "${fontFamily}"`);

    // Draw text
    ctx.font = `80px "${fontFamily}"`;
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(formData.value.signatureText, canvas.width / 2, canvas.height / 2);

    const base64Signature = canvas.toDataURL('image/png');

    // Save style to user profile for future editing reference
    await api.patch(`/users/${authStore.user?.id}`, {
      signatureText: formData.value.signatureText,
      signatureStyle: formData.value.signatureStyle,
    });
    
    // Post to e-signatures backend
    await api.post('/e-signatures', {
      employeeId: authStore.user.employeeId,
      signature: base64Signature,
      status: true
    });

    await authStore.fetchUser();
    toast.success('E-Signature saved successfully');
    showSignatureDialog.value = false;
  } catch (error) {
    console.error(error);
    toast.error('Failed to save E-Signature');
  } finally {
    isLoading.value = false;
  }
};

const handleUploadPhoto = () => {
  fileInput.value?.click();
};

const onFileSelected = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  const file = input.files[0];

  // Basic validation
  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB');
    return;
  }

  if (!file.type.startsWith('image/')) {
    toast.error('File must be an image');
    return;
  }

  selectedFileType.value = file.type;

  // Read file for cropper
  const reader = new FileReader();
  reader.onload = (e) => {
    if (e.target?.result) {
      cropImageSrc.value = e.target.result as string;
      showCropDialog.value = true;
    }
  };
  reader.readAsDataURL(file);

  // Reset input so same file can be selected again
  if (fileInput.value) fileInput.value.value = '';
};

const uploadCroppedImage = async () => {
  if (!cropperRef.value) return;

  const { canvas } = cropperRef.value.getResult();
  if (!canvas) return;

  isUploading.value = true;

  canvas.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      isUploading.value = false;
      toast.error('Failed to crop image');
      return;
    }

    const uploadFormData = new FormData();
    const ext = selectedFileType.value.split('/')[1] || 'png';
    uploadFormData.append('file', blob, `avatar.${ext}`);

    try {
      if (!authStore.user?.id) throw new Error('User ID not found');

      await api.post(`/users/${authStore.user.id}/avatar`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await authStore.fetchUser();
      toast.success('Profile picture updated successfully');
      showCropDialog.value = false;
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload profile picture');
    } finally {
      isUploading.value = false;
    }
  }, selectedFileType.value);
};
</script>

<template>
  <div class="container max-w-[1400px] pt-4 pb-10 space-y-4 animate-in fade-in duration-500">
    <!-- Profile Configuration Section -->
    <Card class="border-0 shadow-2xl shadow-slate-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-xl">
      <CardHeader class="pb-4 px-8 pt-8">
        <CardTitle class="text-lg font-black text-slate-900">Profile Configuration</CardTitle>
        <CardDescription class="text-xs font-medium text-slate-500">Manage your profile picture and view your account details.</CardDescription>
      </CardHeader>
      <CardContent class="p-8 pt-0">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <!-- Left: Profile Picture -->
          <div class="flex flex-col items-center justify-center gap-6">
            <Avatar class="h-40 w-40 border-[6px] border-white shadow-xl ring-1 ring-slate-100/50">
              <AvatarImage
                :src="authStore.userAvatarUrl"
                :alt="authStore.user?.username || ''"
                class="object-cover"
              />
              <AvatarFallback class="text-5xl font-black bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {{ userInitials() }}
              </AvatarFallback>
            </Avatar>

            <div class="text-center space-y-1">
              <h4 class="font-black text-xl text-slate-900">
                {{ authStore.user?.username }}
              </h4>
              <p class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.2em]">
                {{ authStore.user?.id || 'NO-ID-FOUND' }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <input
                type="file"
                ref="fileInput"
                class="hidden"
                accept="image/*"
                @change="onFileSelected"
              />
              <Button
                variant="outline"
                size="sm"
                @click="handleUploadPhoto"
                :disabled="isUploading"
                class="rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 h-9 px-4"
              >
                <Camera class="w-3.5 h-3.5 mr-2" />
                {{ isUploading ? 'Uploading...' : 'Upload New Picture' }}
              </Button>
            </div>
          </div>

          <!-- Right: User Details -->
          <div class="space-y-8 pl-0 md:pl-12 border-l-0 md:border-l border-slate-100">
            <div class="space-y-5">
              <h4 class="font-black text-sm flex items-center gap-2.5 text-slate-800">
                <Shield class="w-4 h-4 text-emerald-500" />
                Account Details
              </h4>

              <div class="grid grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Department</span>
                  <p class="font-black text-sm text-slate-800">{{ authStore.user?.department || 'Information Technology' }}</p>
                </div>
                <div class="space-y-1.5">
                  <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Position</span>
                  <p class="font-black text-sm text-slate-800">{{ authStore.user?.position || 'Assistant Manager' }}</p>
                </div>
                <div class="space-y-1.5">
                  <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Employee ID</span>
                  <p class="font-black text-sm text-slate-800">{{ authStore.user?.employeeId || '-' }}</p>
                </div>
                <div class="space-y-1.5">
                  <span class="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">Status</span>
                  <div class="flex items-center gap-2">
                    <div
                      class="h-2 w-2 rounded-full shadow-sm"
                      :class="authStore.user?.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-rose-500'"
                    ></div>
                    <p class="font-black text-xs uppercase tracking-widest" :class="authStore.user?.status === 'ACTIVE' ? 'text-emerald-600' : 'text-rose-600'">
                      {{ authStore.user?.status || 'ACTIVE' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-4 pt-6 border-t border-slate-100">
              <h4 class="font-black text-sm flex items-center gap-2.5 text-slate-800">
                <PenLine class="w-4 h-4 text-primary" />
                E-Signature
              </h4>
              <div 
                v-if="formData.signatureStyle"
                class="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-center min-h-[80px]"
              >
                <span 
                  class="text-3xl text-slate-800 px-3 text-center leading-relaxed" 
                  :style="{ fontFamily: signatureFonts.find(f => f.name === formData.signatureStyle)?.family || '' }"
                >
                  {{ formData.signatureText || formData.username }}
                </span>
              </div>
              <p v-else class="text-xs font-medium text-slate-500 leading-relaxed">
                You have not configured an E-Signature yet.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
      <!-- General Info -->
      <div class="h-full">
        <!-- Personal Information Section -->
        <Card class="h-full border-0 shadow-xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-xl flex flex-col">
          <CardHeader class="px-8 pt-8 pb-4 flex flex-row items-center justify-between shrink-0">
            <div>
              <CardTitle class="text-base font-black text-slate-900">Personal Information</CardTitle>
              <CardDescription class="text-xs font-medium text-slate-500">Manage your personal information.</CardDescription>
            </div>
            
            <div class="flex items-center gap-2">
              <Button 
                v-if="!isEditingProfile"
                @click="isEditingProfile = true" 
                variant="outline"
                class="rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm"
              >
                Edit
              </Button>
              <template v-else>
                <Button 
                  @click="isEditingProfile = false" 
                  variant="ghost"
                  class="rounded-xl h-10 px-4 font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button 
                  @click="handleSaveProfile" 
                  :disabled="isLoading || isCheckingEmployeeId"
                  class="bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-10 px-6 font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20"
                >
                  {{ isCheckingEmployeeId ? 'Checking...' : (isLoading ? 'Saving...' : 'Save Changes') }}
                </Button>
              </template>
            </div>
          </CardHeader>
          <CardContent class="p-8 pt-2 space-y-8 flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2.5">
                <Label for="username" class="text-xs font-bold text-slate-700">Username</Label>
                <div class="relative">
                  <Input id="username" v-model="formData.username" disabled class="bg-slate-50/50 border-slate-200 text-slate-500 font-medium h-11 rounded-xl px-4 shadow-sm" />
                  <Lock class="w-4 h-4 absolute right-4 top-3.5 text-slate-300" />
                </div>
              </div>
              <div class="space-y-2.5">
                <Label for="email" class="text-xs font-bold text-slate-700">Email</Label>
                <div class="relative">
                  <Input id="email" v-model="formData.email" disabled class="bg-slate-50/50 border-slate-200 text-slate-500 font-medium h-11 rounded-xl px-4 shadow-sm" />
                  <Lock class="w-4 h-4 absolute right-4 top-3.5 text-slate-300" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2.5">
                <Label for="firstName" class="text-xs font-bold text-slate-700">First Name</Label>
                <Input id="firstName" v-model="formData.firstName" :disabled="!isEditingProfile" :class="!isEditingProfile ? 'bg-slate-50 border-slate-100 text-slate-500 shadow-none' : 'border-slate-200 text-slate-900 shadow-sm focus-visible:ring-primary/20'" class="font-bold h-11 rounded-xl px-4 transition-colors" />
              </div>
              <div class="space-y-2.5">
                <Label for="lastName" class="text-xs font-bold text-slate-700">Last Name</Label>
                <Input id="lastName" v-model="formData.lastName" :disabled="!isEditingProfile" :class="!isEditingProfile ? 'bg-slate-50 border-slate-100 text-slate-500 shadow-none' : 'border-slate-200 text-slate-900 shadow-sm focus-visible:ring-primary/20'" class="font-bold h-11 rounded-xl px-4 transition-colors" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-2.5">
                <Label for="displayName" class="text-xs font-bold text-slate-700">Display Name</Label>
                <Input id="displayName" v-model="formData.displayName" :disabled="!isEditingProfile" :class="!isEditingProfile ? 'bg-slate-50 border-slate-100 text-slate-500 shadow-none' : 'border-slate-200 text-slate-900 shadow-sm focus-visible:ring-primary/20'" class="font-bold h-11 rounded-xl px-4 transition-colors" />
              </div>
              <div class="space-y-2.5">
                <Label for="employeeId" class="text-xs font-bold text-slate-700">Employee ID</Label>
                <Input id="employeeId" v-model="formData.employeeId" :disabled="!isEditingProfile" :class="!isEditingProfile ? 'bg-slate-50 border-slate-100 text-slate-500 shadow-none' : 'border-slate-200 text-slate-900 shadow-sm focus-visible:ring-primary/20'" class="font-bold h-11 rounded-xl px-4 transition-colors" />
                <p v-if="employeeIdError" class="text-xs text-red-600 mt-1">{{ employeeIdError }}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Security -->
      <div class="h-full">
        <Card class="h-full border-0 shadow-xl shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur-xl flex flex-col">
          <CardHeader class="px-8 pt-8 pb-4 shrink-0">
            <CardTitle class="text-base font-black text-slate-900">Security & Signatures</CardTitle>
            <CardDescription class="text-xs font-medium text-slate-500">Manage your passwords, PIN, and digital signature.</CardDescription>
          </CardHeader>
          <CardContent class="p-8 pt-2 space-y-4 flex-1">
            <!-- Password Section -->
            <div class="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-slate-200 hover:shadow-md transition-all">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Lock class="w-5 h-5 text-indigo-500" />
                </div>
                <div>
                  <h4 class="font-black text-sm text-slate-900">Password</h4>
                  <p class="text-xs font-medium text-slate-500 mt-0.5">Change your password logic here.</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                @click="showPasswordDialog = true"
                class="rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 h-10 px-6 shrink-0"
              >
                Change Password
              </Button>
            </div>

            <!-- PIN Code Section -->
            <div class="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-slate-200 hover:shadow-md transition-all">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Shield class="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 class="font-black text-sm text-slate-900">Transaction PIN</h4>
                  <p class="text-xs font-medium text-slate-500 mt-0.5">
                    Verify sensitive actions with a 4-6 digit PIN.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                @click="showPinDialog = true"
                class="rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 h-10 px-6 shrink-0"
              >
                {{ hasPin ? 'Change PIN' : 'Set PIN' }}
              </Button>
            </div>

            <!-- Signature Section -->
            <div class="flex items-center justify-between p-5 border border-slate-100 rounded-2xl bg-white shadow-sm hover:border-slate-200 hover:shadow-md transition-all">
              <div class="flex items-center gap-5">
                <div class="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
                  <PenLine class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 class="font-black text-sm text-slate-900">E-Signature</h4>
                  <p class="text-xs font-medium text-slate-500 mt-0.5">
                    Configure your digital signature style across {{ signatureFonts.length }} fonts.
                  </p>
                </div>
              </div>
              <Button 
                variant="outline" 
                @click="showSignatureDialog = true"
                class="rounded-xl font-bold text-xs uppercase tracking-widest border-slate-200 hover:bg-slate-50 text-slate-600 h-10 px-6 shrink-0"
              >
                Set Signature
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Background Decorations -->
    <div
      class="fixed inset-0 pointer-events-none -z-10 overflow-hidden"
    >
      <div class="absolute top-20 right-[10%] opacity-[0.03] text-primary select-none rotate-12 scale-150 transform-gpu">
         <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-fingerprint"><path d="M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.5 19.5c.5-1.5 1-4.5 1-7.5a2.5 2.5 0 0 1 5 0c0 3 .5 6 1 7.5"/><path d="M15.5 19.5c.5-1.5 1-4.5 1-7.5a6 6 0 0 0-12 0c0 3 .5 6 1 7.5"/><path d="M19 19.5c.5-1.5 1-4.5 1-7.5a9.5 9.5 0 0 0-19 0c0 3 .5 6 1 7.5"/></svg>
      </div>
      <div class="absolute bottom-20 left-[10%] opacity-[0.03] text-primary select-none -rotate-12 scale-150 transform-gpu">
         <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-key"><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4Z"/><path d="m21.2 12.2-7.8 7.8c-.8.8-2 .8-2.8 0l-3.2-3.2a2 2 0 0 1 0-2.8l7.8-7.8"/><path d="M10 10 3 17v4h4l3-3"/><path d="m14 14-3 3"/></svg>
      </div>
    </div>
    <!-- PIN Dialog -->
    <Dialog v-model:open="showPinDialog">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{{ hasPin ? 'Change Transaction PIN' : 'Set Transaction PIN' }}</DialogTitle>
          <DialogDescription>
            Enter a 4-6 digit PIN for verifying sensitive transactions.
          </DialogDescription>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <Label>New PIN</Label>
            <Input v-model="pinData.pin" type="password" maxlength="6" placeholder="Enter PIN" />
          </div>
          <div class="space-y-2">
            <Label>Confirm PIN</Label>
            <Input
              v-model="pinData.confirmPin"
              type="password"
              maxlength="6"
              placeholder="Confirm PIN"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showPinDialog = false">Cancel</Button>
          <Button @click="handleSavePin" :disabled="isSavingPin">
            {{ isSavingPin ? 'Saving...' : 'Save PIN' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Crop Image Dialog -->
    <Dialog v-model:open="showCropDialog">
      <DialogContent class="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription> Adjust your profile picture. </DialogDescription>
        </DialogHeader>
        <div class="py-4 w-full overflow-hidden flex justify-center">
          <div class="w-full max-w-[500px] h-[400px] rounded-lg overflow-hidden border">
            <Cropper
              ref="cropperRef"
              class="h-full w-full"
              :src="cropImageSrc"
              :stencil-component="StencilComponent"
              :stencil-props="{
                aspectRatio: 1,
              }"
              image-restriction="stencil"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="showCropDialog = false">Cancel</Button>
          <Button @click="uploadCroppedImage" :disabled="isUploading">
            {{ isUploading ? 'Uploading...' : 'Save & Upload' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="showSignatureDialog">
      <DialogContent class="sm:max-w-xl p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <DialogHeader class="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle class="text-lg font-black text-slate-900 flex items-center gap-2">
            <PenLine class="w-5 h-5 text-primary" />
            Configure E-Signature
          </DialogTitle>
          <DialogDescription class="text-xs font-medium text-slate-500">
            Design your digital signature for signing documents.
          </DialogDescription>
        </DialogHeader>
        <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto hide-scrollbar">
          <div class="space-y-2.5">
            <Label for="dialogSignatureText" class="text-xs font-bold text-slate-700">Signature Name</Label>
            <Input id="dialogSignatureText" v-model="formData.signatureText" placeholder="e.g. Apiwat Sukjaroen" class="border-slate-200 text-slate-900 font-bold h-11 rounded-xl px-4 shadow-sm focus-visible:ring-primary/20" />
          </div>

          <div class="space-y-4 pt-2">
            <Label class="text-xs font-bold text-slate-700">Select Style ({{ signatureFonts.length }} available)</Label>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div 
                v-for="font in signatureFonts" 
                :key="font.name"
                @click="formData.signatureStyle = font.name"
                class="relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-center min-h-[80px] overflow-hidden group"
                :class="formData.signatureStyle === font.name ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 bg-white'"
              >
                <div class="absolute top-3 right-3">
                  <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                       :class="formData.signatureStyle === font.name ? 'border-primary bg-primary' : 'border-slate-300'">
                    <Check v-if="formData.signatureStyle === font.name" class="w-2.5 h-2.5 text-primary-foreground" stroke-width="3" />
                  </div>
                </div>
                <span 
                  class="text-3xl text-slate-800 px-3 text-center leading-relaxed truncate w-full" 
                  :style="{ fontFamily: font.family }"
                >
                  {{ formData.signatureText || 'Apiwat Sukjaroen' }}
                </span>
                <span class="absolute bottom-1.5 left-3 text-[0.6rem] font-bold text-slate-400 capitalize opacity-50 group-hover:opacity-100 transition-opacity">
                  {{ font.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter class="p-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="outline" @click="showSignatureDialog = false" class="rounded-xl h-10 px-6 font-bold text-xs uppercase tracking-widest text-slate-600 border-slate-200">
            Cancel
          </Button>
          <Button 
            @click="handleSaveSignature" 
            :disabled="isLoading"
            class="rounded-xl h-10 px-6 font-black text-xs uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
          >
            {{ isLoading ? 'Saving...' : 'Save Signature' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Change Password Dialog -->
    <Dialog v-model:open="showPasswordDialog">
      <DialogContent class="sm:max-w-md border-0 shadow-2xl rounded-2xl overflow-hidden p-0">
        <DialogHeader class="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <DialogTitle class="text-xl font-black text-slate-900 flex items-center gap-2 text-center justify-center pb-2">
            Change Password
          </DialogTitle>
          <DialogDescription class="text-xs font-medium text-slate-500 text-center">
            You are required to change your password to continue.
          </DialogDescription>
        </DialogHeader>
        <div class="p-6 space-y-5">
          <div v-if="errorMsg" class="p-3 text-xs font-bold text-red-500 bg-red-50 rounded-xl flex items-center justify-center">
            {{ errorMsg }}
          </div>
          
          <div class="space-y-2">
            <Label class="text-xs font-bold text-slate-700">Old Password</Label>
            <Input v-model="passwordData.oldPassword" type="password" class="h-11 rounded-xl border-slate-200 shadow-sm px-4 focus-visible:ring-primary/20" />
          </div>
          <div class="space-y-2">
            <Label class="text-xs font-bold text-slate-700">New Password</Label>
            <Input v-model="passwordData.newPassword" type="password" class="h-11 rounded-xl border-slate-200 shadow-sm px-4 focus-visible:ring-primary/20" />
          </div>
          <div class="space-y-2">
            <Label class="text-xs font-bold text-slate-700">Confirm Password</Label>
            <Input v-model="passwordData.confirmPassword" type="password" class="h-11 rounded-xl border-slate-200 shadow-sm px-4 focus-visible:ring-primary/20" />
          </div>
        </div>
        <DialogFooter class="p-6 pt-0">
          <Button 
            @click="handleSavePassword" 
            :disabled="isLoading || !passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword" 
            class="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-xl h-11 font-black text-xs uppercase tracking-widest shadow-lg shadow-teal-500/20"
          >
            {{ isLoading ? 'Saving...' : 'Change Password' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
