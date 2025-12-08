import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { uploadTaxSlip, deleteTaxSlip } from "@/actions/tax-slip.actions";

export function useUploadTaxSlip() {
    const router = useRouter();
    
    return useMutation({
        mutationFn: (formData: FormData) => uploadTaxSlip(formData),
        onSuccess: (result) => {
            if (result.success) {
                // Trigger page refresh to get updated data
                router.refresh();
            }
        },
    });
}

export function useDeleteTaxSlip() {
    const router = useRouter();
    
    return useMutation({
        mutationFn: (id: string) => deleteTaxSlip(id),
        onSuccess: (result) => {
            if (result.success) {
                // Trigger page refresh to get updated data
                router.refresh();
            }
        },
    });
}
