CREATE OR REPLACE FUNCTION fun_uc_opciones_listar(p_idu_menu_categoria INTEGER, p_ido_menu_opcion INTEGER, p_opc_activo BOOLEAN)
/********************************************************************************************************
      FECHA:  21/09/2017.
DESCRIPCION:  LISTA OPCIONES DE LA UTILERIA CENTRALIZADOR.
    REALIZO:  URIEL GAMEZ.
   SOLICITO:  LEOPOLDO VAZQUEZ.
*********************************************************************************************************/
RETURNS TABLE
    (
        idu_menu_categoria SMALLINT,
        idu_menu_opcion SMALLINT,
        nom_menu_opcion VARCHAR(50),
        des_url VARCHAR(100),
        nom_state VARCHAR(100),
        num_orden SMALLINT,
        opc_activo BOOLEAN
    )
    AS
$BODY$
BEGIN
	RETURN QUERY
        -- &
		SELECT 
            opc.idu_menu_categoria,
            opc.idu_menu_opcion,
            opc.nom_menu_opcion,
            opc.des_url,
            opc.nom_state,
            opc.num_orden,
            opc.opc_activo
        -- &
		FROM cat_uc_menu_opciones AS opc
        JOIN cat_uc_menu_categorias AS cat
        ON cat.idu_menu_categoria = opc.idu_menu_categoria
        WHERE (p_idu_menu_categoria IS NULL OR opc.idu_menu_categoria = p_idu_menu_categoria)
            AND (p_ido_menu_opcion IS NULL OR opc.idu_menu_opcion = p_ido_menu_opcion)
            AND (p_opc_activo IS NULL OR opc.opc_activo = p_opc_activo)
        -- &
		ORDER BY opc.num_orden;
END;
$BODY$
  LANGUAGE 'plpgsql' VOLATILE;
GRANT EXECUTE ON FUNCTION fun_uc_opciones_listar(INTEGER, INTEGER, BOOLEAN) TO sysutileria;

COMMENT ON FUNCTION fun_uc_opciones_listar(INTEGER, INTEGER, BOOLEAN) IS 
'LISTA OPCIONES DE LA UTILERIA CENTRALIZADOR.';