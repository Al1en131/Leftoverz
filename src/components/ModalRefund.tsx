import { useState } from "react";

type RefundModalProps = {
  orderId: string;
  onSuccess?: () => void;
};

export default function RefundModal({ orderId, onSuccess }: RefundModalProps) {
  const [reason, setReason] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("amount", amount);
    formData.append("reason", reason);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`https://backend-leftoverz-production.up.railway.app/api/v1/transaction/${orderId}/refund`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Refund gagal");

      alert("Refund berhasil!");
      setShowModal(false);
      onSuccess?.(); // Optional callback
    } catch (err: any) {
      alert("Gagal refund: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Refund
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Ajukan Refund</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block mb-1">Alasan</label>
                <textarea
                  required
                  className="w-full border rounded p-2"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">Jumlah Refund</label>
                <input
                  required
                  type="number"
                  className="w-full border rounded p-2"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="block mb-1">Upload Bukti (opsional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {loading ? "Mengirim..." : "Kirim Refund"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
