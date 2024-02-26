import { useRouter } from "next/router";
import { motion } from "framer-motion";
import Layout from "@/components/layout";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import DisplayReviewProfile from "@/components/review/review-profile";
import { useEffect, useState } from "react";
import { LoadingCircle } from "@/components/shared/icons";

export default function PhotoPage() {
  const router = useRouter();
  const { id } = router.query;
  const [image, setImage] = useState<string>("");

  console.log("image", image);

  useEffect(() => {
    if (id) {
      fetch(`/api/v1/posts/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error("Something went wrong on the api server!");
          }
        })
        .then((data) => {
          console.log("data", data);
          setImage(data.data.photo);
        })
        .catch((error) => {
          console.error(error);
          alert("Something went wrong. Please try again later.");
        });
    }
  }, [id]);

  return (
    <Layout>
      <Toaster />
      <motion.div
        className="z-10 flex max-w-2xl flex-col items-center gap-2 px-5 xl:px-0"
        initial="hidden"
        whileInView="show"
        animate="show"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.h1
          className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          Your Results
        </motion.h1>
        <div className="min-h-72">
          {image ? (
            <Image
              src={image}
              alt="Dating profile"
              width={200}
              height={200}
              className="mb-5"
            />
          ) : (
            <LoadingCircle />
          )}
        </div>

        {image && <DisplayReviewProfile image={image} />}
      </motion.div>
    </Layout>
  );
}
