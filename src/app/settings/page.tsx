"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSettings } from "@/hooks/use-settings";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/layout/header";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const settingsSchema = z.object({
  appName: z.string().min(1, "Nama aplikasi tidak boleh kosong."),
  address: z.string().min(1, "Alamat tidak boleh kosong."),
  phone: z.string().min(1, "Nomor telepon tidak boleh kosong."),
  receiptFooter: z.string().min(1, "Pesan struk tidak boleh kosong."),
});

export default function SettingsPage() {
  const { settings, updateSettings, isLoading } = useSettings();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    values: settings || { appName: "", address: "", phone: "", receiptFooter: "" },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateSettings(values);
    toast({
      title: "Pengaturan Disimpan",
      description: "Pengaturan aplikasi telah berhasil diperbarui.",
    });
  };

  if (isLoading) {
    return (
      <>
        <Header title="Pengaturan" />
        <Card>
          <CardHeader>
            <CardTitle>Informasi Toko & Struk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <Header title="Pengaturan" />
      <Card>
        <CardHeader>
          <CardTitle>Informasi Toko & Struk</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="appName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Aplikasi / Kop Struk</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama Toko Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat</FormLabel>
                    <FormControl>
                      <Input placeholder="Alamat Toko" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor Telepon</FormLabel>
                    <FormControl>
                      <Input placeholder="Nomor Telepon Toko" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="receiptFooter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pesan Singkat di Struk</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="cth., Terima kasih telah berbelanja!"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Simpan Pengaturan</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
