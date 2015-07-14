<?xml version="1.0"?>
<xsl:stylesheet version="1.0" exclude-result-prefixes="xsl xi #default"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:xi="http://www.w3.org/2001/XInclude"
	xmlns="http://www.w3.org/1999/xhtml">

<xsl:output method="xml" encoding="UTF-8" omit-xml-declaration="yes" />
<xsl:template match="@*|node()">
	<xsl:copy>
		<xsl:apply-templates select="@*|node()" />
	</xsl:copy>
</xsl:template>

</xsl:stylesheet>
