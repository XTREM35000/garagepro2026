import { motion } from "framer-motion";

export default function ActionBar({ actions }: any) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-neutral-900 shadow-card rounded-2xl px-4 py-3 flex gap-4 z-50"
    >
      {actions.map((action: any, i: number) => (
        <button
          key={i}
          onClick={action.onClick}
          className="flex flex-col items-center text-xs"
        >
          <action.icon size={20} />
          {action.label}
        </button>
      ))}
    </motion.div>
  );
}
