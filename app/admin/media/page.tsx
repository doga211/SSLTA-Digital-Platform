// "use client";

// import { useCallback, useEffect, useState } from "react";
// import { Plus } from "lucide-react";
// import MediaUploadDialog from "@/components/admin/media/MediaUploadDialog";
// import MediaReviewControls from "@/components/admin/media/MediaReviewsControls";

// type MediaItem = {
// 	id?: string | number;
// 	title?: string;
// 	name?: string;
// 	url?: string;
// 	imageUrl?: string;
// 	status?: string;
// 	type?: string;
// 	permission_status?: string;
// 	consent_status?: string;
// 	event_attribution_verified?: boolean;
// 	publication_status?: string;
// };

// export default function AdminMediaPage() {
// 	const [media, setMedia] = useState<MediaItem[]>([]);
// 	const [uploadOpen, setUploadOpen] = useState(false);
// 	const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState("");

// 	const loadMedia = useCallback(async (page = 1) => {
// 		setLoading(true);
// 		setError("");
// 		try {
// 			const response = await fetch(`/api/admin/media?page=${page}`);
// 			if (!response.ok) throw new Error("Unable to load media.");
// 			const result = await response.json();
// 			const items = Array.isArray(result)
// 				? result
// 				: result.media ?? result.items ?? result.data ?? [];
// 			setMedia(Array.isArray(items) ? items : []);
// 		} catch (loadError) {
// 			setError(loadError instanceof Error ? loadError.message : "Unable to load media.");
// 			setMedia([]);
// 		} finally {
// 			setLoading(false);
// 		}
// 	}, []);

// 	useEffect(() => {
// 		void loadMedia(1);
// 	}, [loadMedia]);

// 	return (
// 		<main className="space-y-6 p-6">
// 			<header className="flex flex-wrap items-center justify-between gap-4">
// 				<div>
// 					<h1 className="text-2xl font-semibold text-slate-900">Media</h1>
// 					<p className="mt-1 text-sm text-slate-600">Upload and review media submissions.</p>
// 				</div>
// 				<button
// 					type="button"
// 					onClick={() => setUploadOpen(true)}
// 					className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white"
// 				>
// 					<Plus size={18} />
// 					Upload Media
// 				</button>
// 			</header>

// 			{error && <p role="alert" className="text-sm text-red-600">{error}</p>}
// 			{loading ? (
// 				<p className="py-10 text-center text-sm text-slate-500">Loading media…</p>
// 			) : media.length === 0 ? (
// 				<p className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-500">
// 					No media found.
// 				</p>
// 			) : (
// 				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// 					{media.map((item, index) => {
// 						const title = item.title ?? item.name ?? "Untitled media";
// 						return (
// 							<article
// 								key={item.id ?? `${title}-${index}`}
// 								className="overflow-hidden rounded-xl border bg-white"
// 							>
// 								{item.imageUrl || item.url ? (
// 									<img
// 										src={item.imageUrl ?? item.url}
// 										alt={title}
// 										className="h-48 w-full object-cover"
// 									/>
// 								) : (
// 									<div className="flex h-48 items-center justify-center bg-slate-100 text-sm text-slate-500">
// 										Preview unavailable
// 									</div>
// 								)}
// 								<div className="space-y-3 p-4">
// 									<div>
// 										<h2 className="font-medium text-slate-900">{title}</h2>
// 										<p className="mt-1 text-sm text-slate-500">
// 											{[item.type, item.status].filter(Boolean).join(" · ") || "Media submission"}
// 										</p>
// 									</div>
// 									<button
// 										type="button"
// 										onClick={() => {
// 											if (item.id != null) setSelectedMedia({ ...item, id: String(item.id) });
// 										}}
// 										disabled={item.id == null}
// 										className="rounded-lg border px-3 py-2 text-sm"
// 									>
// 										Review Media
// 									</button>
// 								</div>
// 							</article>
// 						);
// 					})}
// 				</div>
// 			)}

// 			{uploadOpen && (
// 				<MediaUploadDialog
// 					onClose={() => setUploadOpen(false)}
// 					onSuccess={() => void loadMedia(1)}
// 				/>
// 			)}

// 			{selectedMedia && (
// 				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
// 					<div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5">
// 						<div className="mb-4 flex items-center justify-between">
// 							<h2 className="text-xl font-semibold">Review Media</h2>
// 							<button
// 								type="button"
// 								onClick={() => setSelectedMedia(null)}
// 								className="rounded-lg border px-3 py-1"
// 							>
// 								Close
// 							</button>
// 						</div>
// 						<MediaReviewControls
// 							media={{
// 								...selectedMedia,
// 								id: String(selectedMedia.id),
// 								permission_status: selectedMedia.permission_status ?? "pending",
// 								consent_status: selectedMedia.consent_status ?? "pending",
// 								event_attribution_verified: selectedMedia.event_attribution_verified ?? false,
// 								publication_status: selectedMedia.publication_status ?? "pending",
// 							}}
// 							onUpdatedAction={() => {
// 								setSelectedMedia(null);
// 								void loadMedia(1);
// 							}}
// 						/>
// 					</div>
// 				</div>
// 			)}
// 		</main>
// 	);
// }






"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, ImageOff } from "lucide-react";
import MediaUploadDialog from "@/components/admin/media/MediaUploadDialog";
import MediaReviewControls from "@/components/admin/media/MediaReviewsControls";

type MediaItem = {
    id?: string | number;
    title?: string | null;
    name?: string | null;
    url?: string | null;
    imageUrl?: string | null;
    file_url?: string | null;
    status?: string | null;
    type?: string | null;
    media_type?: string | null;
    permission_status?: string | null;
    consent_status?: string | null;
    event_attribution_verified?: boolean;
    publication_status?: string | null;
    preview_url?: string | null;
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

function resolveMediaUrl(item: MediaItem): string | null {
    // const source = item.file_url || item.imageUrl || item.url;
    const source =
    item.preview_url ||
    item.imageUrl ||
    item.url ||
    item.file_url;

    if (!source) return null;

    // Already a complete browser-accessible URL.
    if (/^https?:\/\//i.test(source)) {
        return source;
    }

    // Existing local public assets.
    if (source.startsWith("/")) {
        return source;
    }

    // Resolve custom Supabase Storage references.
    if (source.startsWith("storage://")) {
        if (!SUPABASE_URL) return null;

        const reference = source.slice("storage://".length);
        const separator = reference.indexOf("/");

        if (separator === -1) return null;

        const bucket = reference.slice(0, separator);
        const path = reference.slice(separator + 1);

        if (!bucket || !path) return null;

        const encodedPath = path
            .split("/")
            .map((segment) => encodeURIComponent(segment))
            .join("/");

        return `${SUPABASE_URL}/storage/v1/object/public/${encodeURIComponent(bucket)}/${encodedPath}`;
    }

    return null;
}

function MediaPreview({
    item,
    title,
}: {
    item: MediaItem;
    title: string;
}) {
    const [failed, setFailed] = useState(false);
    const imageUrl = resolveMediaUrl(item);
type MediaItem = {
    id?: string | number;
    title?: string | null;
    name?: string | null;
    url?: string | null;
    imageUrl?: string | null;
    preview_url?: string | null;
    file_url?: string | null;
    status?: string | null;
    type?: string | null;
    media_type?: string | null;
    permission_status?: string | null;
    consent_status?: string | null;
    event_attribution_verified?: boolean;
    publication_status?: string | null;
};
    if (!imageUrl || failed) {
        return (
            <div className="flex h-48 flex-col items-center justify-center gap-2 bg-slate-100 text-sm text-slate-500">
                <ImageOff size={28} />
                <span>Preview unavailable</span>
            </div>
        );
    }

    return (
        <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-48 w-full bg-slate-100 object-cover"
        />
    );
}

export default function AdminMediaPage() {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadMedia = useCallback(async (page = 1) => {
        setLoading(true);
        setError("");

        try {
            const response = await fetch(`/api/admin/media?page=${page}`);

            if (!response.ok) {
                throw new Error("Unable to load media.");
            }

            const result = await response.json();

            const items = Array.isArray(result)
                ? result
                : result.media ?? result.items ?? result.data ?? [];

            setMedia(Array.isArray(items) ? items : []);
        } catch (loadError) {
            setError(
                loadError instanceof Error
                    ? loadError.message
                    : "Unable to load media."
            );
            setMedia([]);
        } finally {
            setLoading(false);
        }
    }, []);
    

    useEffect(() => {
        void loadMedia(1);
    }, [loadMedia]);

    return (
        <main className="space-y-6 p-6">
            <header className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Media
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Upload and review media submissions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-white"
                >
                    <Plus size={18} />
                    Upload Media
                </button>
            </header>

            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}

            {loading ? (
                <p className="py-10 text-center text-sm text-slate-500">
                    Loading media…
                </p>
            ) : media.length === 0 ? (
                <p className="rounded-xl border border-dashed p-10 text-center text-sm text-slate-500">
                    No media found.
                </p>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {media.map((item, index) => {
                        const title =
                            item.title || item.name || "Untitled media";

                        return (
                            <article
                                key={item.id ?? `${title}-${index}`}
                                className="overflow-hidden rounded-xl border bg-white"
                            >
                                <MediaPreview
                                    item={item}
                                    title={title}
                                />

                                <div className="space-y-3 p-4">
                                    <div>
                                        <h2 className="font-medium text-slate-900">
                                            {title}
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {[
                                                item.media_type || item.type,
                                                item.publication_status || item.status,
                                            ]
                                                .filter(Boolean)
                                                .join(" · ") ||
                                                "Media submission"}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (item.id != null) {
                                                setSelectedMedia({
                                                    ...item,
                                                    id: String(item.id),
                                                });
                                            }
                                        }}
                                        disabled={item.id == null}
                                        className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50"
                                    >
                                        Review Media
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {uploadOpen && (
                <MediaUploadDialog
                    onClose={() => setUploadOpen(false)}
                    onSuccess={() => void loadMedia(1)}
                />
            )}

            {selectedMedia && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Review Media
                            </h2>

                            <button
                                type="button"
                                onClick={() => setSelectedMedia(null)}
                                className="rounded-lg border px-3 py-1"
                            >
                                Close
                            </button>
                        </div>

                        <MediaReviewControls
                            media={{
                                ...selectedMedia,
                                id: String(selectedMedia.id),
                                permission_status:
                                    selectedMedia.permission_status ?? "pending",
                                consent_status:
                                    selectedMedia.consent_status ?? "pending",
                                event_attribution_verified:
                                    selectedMedia.event_attribution_verified ?? false,
                                publication_status:
                                    selectedMedia.publication_status ?? "pending",
                                    
                            }}
                            
                            onUpdatedAction={() => {
                                setSelectedMedia(null);
                                void loadMedia(1);
                            }}
                        />
                    </div>
                </div>
            )}
        </main>
    );
}
