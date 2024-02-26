import Layout from "@/components/layout";
import Balancer from "react-wrap-balancer";
import { motion } from "framer-motion";
import { FADE_DOWN_ANIMATION_VARIANTS } from "@/lib/constants";
import { useUploadModal } from "@/components/home/upload-modal";
import { Upload } from "lucide-react";
import { redis } from "@/lib/upstash";

export default function Home({ count }: { count: number }) {
  const { UploadModal, setShowUploadModal } = useUploadModal();

  return (
    <Layout>
      <UploadModal />
      <motion.div
        className="z-10 max-w-2xl px-5 xl:px-0"
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
          <Balancer>Review your dating profile with AI</Balancer>
        </motion.h1>
        <motion.p
          className="mt-6 text-center text-gray-500 md:text-xl"
          variants={FADE_DOWN_ANIMATION_VARIANTS}
        >
          <Balancer ratio={0.6}>
            Unlock the potential of your dating profile with AI-driven insights
          </Balancer>
        </motion.p>
        <motion.div variants={FADE_DOWN_ANIMATION_VARIANTS} className="-mb-4">
          <button
            className="group mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full border border-black bg-black px-5 py-2 text-sm text-white transition-colors hover:bg-white hover:text-black"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="h-5 w-5 text-white group-hover:text-black" />
            <p>Upload a photo</p>
          </button>
        </motion.div>
      </motion.div>
    </Layout>
  );
}

export async function getStaticProps() {
  const count = await redis.dbsize();
  return {
    props: {
      count,
    },
    revalidate: 60,
  };
}
