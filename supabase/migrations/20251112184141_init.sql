


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "planner_id" bigint NOT NULL
);


ALTER TABLE "public"."categories" OWNER TO "supabase_admin";


ALTER TABLE "public"."categories" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."events" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "datetime" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category_id" bigint NOT NULL
);


ALTER TABLE "public"."events" OWNER TO "supabase_admin";


ALTER TABLE "public"."events" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."events_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "note" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category_id" bigint NOT NULL
);


ALTER TABLE "public"."notes" OWNER TO "supabase_admin";


ALTER TABLE "public"."notes" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."notes_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."planners" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "b_color" "text" NOT NULL,
    "a_color" "text" NOT NULL,
    "font" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."planners" OWNER TO "supabase_admin";


ALTER TABLE "public"."planners" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."planners_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."tasks" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "task" "text" NOT NULL,
    "date" "date" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "category_id" bigint NOT NULL
);


ALTER TABLE "public"."tasks" OWNER TO "supabase_admin";


ALTER TABLE "public"."tasks" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."tasks_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."planners"
    ADD CONSTRAINT "planners_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_planner_id_fkey" FOREIGN KEY ("planner_id") REFERENCES "public"."planners"("id");



ALTER TABLE ONLY "public"."events"
    ADD CONSTRAINT "events_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");



ALTER TABLE ONLY "public"."planners"
    ADD CONSTRAINT "planners_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tasks"
    ADD CONSTRAINT "tasks_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id");





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";





GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";














































































































































































GRANT ALL ON TABLE "public"."categories" TO "postgres";
GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."events" TO "postgres";
GRANT ALL ON TABLE "public"."events" TO "anon";
GRANT ALL ON TABLE "public"."events" TO "authenticated";
GRANT ALL ON TABLE "public"."events" TO "service_role";



GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."events_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "postgres";
GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."notes_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."planners" TO "postgres";
GRANT ALL ON TABLE "public"."planners" TO "anon";
GRANT ALL ON TABLE "public"."planners" TO "authenticated";
GRANT ALL ON TABLE "public"."planners" TO "service_role";



GRANT ALL ON SEQUENCE "public"."planners_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."planners_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."planners_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."planners_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."tasks" TO "postgres";
GRANT ALL ON TABLE "public"."tasks" TO "anon";
GRANT ALL ON TABLE "public"."tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."tasks" TO "service_role";



GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "postgres";
GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."tasks_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































