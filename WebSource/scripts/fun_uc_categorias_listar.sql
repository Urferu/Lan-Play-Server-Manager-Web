CREATE OR REPLACE FUNCTION fun_uc_categorias_listar(p_idu_categoria INTEGER, p_opc_activo BOOLEAN)
/********************************************************************************************************
      FECHA:  21/09/2017.
DESCRIPCION:  LISTA CATEGORIAS DE LA UTILERIA CENTRALIZADOR.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
RETURNS TABLE
    (
        idu_menu_categoria SMALLINT,
        nom_menu_categoria VARCHAR(50),
        nom_icono VARCHAR(50),
        num_orden SMALLINT,
        opc_activo BOOLEAN
    )
    AS
$BODY$
BEGIN
	RETURN QUERY
        -- &
		SELECT 
            cat.idu_menu_categoria,
            cat.nom_menu_categoria,
			cat.nom_icono,
            cat.num_orden,
            cat.opc_activo
        -- &
		FROM cat_uc_menu_categorias AS cat
        WHERE (p_idu_categoria = NULL OR cat.idu_menu_categoria = p_idu_categoria)
            AND (p_opc_activo = NULL OR opc_activo = p_opc_activo)
        -- &
		ORDER BY cat.num_orden;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
GRANT EXECUTE ON FUNCTION fun_uc_categorias_listar(INTEGER, BOOLEAN) TO sysutileria;

COMMENT ON FUNCTION fun_uc_categorias_listar(INTEGER, BOOLEAN) IS 
'LISTA CATEGORIAS DE LA UTILERIA CENTRALIZADOR.';